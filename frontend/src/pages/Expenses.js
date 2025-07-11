import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/expense.css';
import { exportToCSV } from '../utils/exportCSV';

const Expenses = () => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');

  const BACKEND_URL = 'https://expense-tracker-pm4n.onrender.com';

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/expenses`);
        setExpenses(res.data);
      } catch (err) {
        console.error('Error fetching expenses:', err);
      }
    };

    fetchExpenses();
  }, [BACKEND_URL]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    const now = new Date();
    const newExpense = {
      title,
      amount: parseFloat(amount),
      date: now.toLocaleDateString(),
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    };

    try {
      const res = await axios.post(`${BACKEND_URL}/api/expenses`, newExpense);
      setExpenses([res.data, ...expenses]);
      setTitle('');
      setAmount('');
    } catch (err) {
      console.error('Error adding expense:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/expenses/${id}`);
      setExpenses(expenses.filter((e) => e._id !== id));
    } catch (err) {
      console.error('Error deleting expense:', err);
    }
  };

  const filteredExpenses = expenses.filter((exp) => {
    const matchMonth = filterMonth ? exp.month === parseInt(filterMonth) : true;
    const matchYear = filterYear ? exp.year === parseInt(filterYear) : true;
    return matchMonth && matchYear;
  });

  const total = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="expenses-container">
      <h2>Expense Tracker</h2>

      <div className="filters">
        <select onChange={(e) => setFilterMonth(e.target.value)} value={filterMonth}>
          <option value="">All Months</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option value={i + 1} key={i}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>

        <select onChange={(e) => setFilterYear(e.target.value)} value={filterYear}>
          <option value="">All Years</option>
          {[...new Set(expenses.map((exp) => exp.year))].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="total-expense">Total: ₹{total.toFixed(2)}</div>

      <form className="expense-form" onSubmit={handleAddExpense}>
        <input
          type="text"
          placeholder="Expense Details"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount in ₹"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <h3>Expense History</h3>
      <ul className="expense-list">
        {filteredExpenses.length === 0 && <p>No expenses to display.</p>}
        {filteredExpenses.map((exp) => (
          <li key={exp._id}>
            <div>
              <strong>{exp.title}</strong> - ₹{exp.amount}
              <button className="delete-btn" onClick={() => handleDelete(exp._id)}>
                Delete
              </button>
            </div>
            <small>{exp.date}</small>
          </li>
        ))}
      </ul>

      <button
        className="export-btn"
        onClick={() => exportToCSV(filteredExpenses, 'expenses.csv')}
      >
        Export to CSV
      </button>
    </div>
  );
};

export default Expenses;
