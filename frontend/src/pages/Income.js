import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/income.css';
import { exportToCSV } from '../utils/exportCSV';

const Income = () => {
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [incomeList, setIncomeList] = useState([]);
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');

  const BACKEND_URL = 'https://expense-tracker-pm4n.onrender.com';

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/income`);
        setIncomeList(res.data);
      } catch (err) {
        console.error('Failed to fetch income:', err);
      }
    };

    fetchIncome();
  }, [BACKEND_URL]);

  const handleAddIncome = async (e) => {
    e.preventDefault();
    if (!source || !amount) return;

    const now = new Date();
    const newIncome = {
      source,
      amount: parseFloat(amount),
      date: now.toLocaleDateString(),
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    };

    try {
      const res = await axios.post(`${BACKEND_URL}/api/income`, newIncome);
      setIncomeList([res.data, ...incomeList]);
      setSource('');
      setAmount('');
    } catch (err) {
      console.error('Failed to add income:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/income/${id}`);
      setIncomeList(incomeList.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Failed to delete income:', err);
    }
  };

  const filteredIncome = incomeList.filter((item) => {
    const matchMonth = filterMonth ? item.month === parseInt(filterMonth) : true;
    const matchYear = filterYear ? item.year === parseInt(filterYear) : true;
    return matchMonth && matchYear;
  });

  const totalIncome = filteredIncome.reduce((acc, item) => acc + item.amount, 0);

  return (
    <div className="income-container">
      <h2>Income Tracker</h2>

      {/* Filters */}
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
          {[...new Set(incomeList.map((item) => item.year))].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Total */}
      <div className="total-income">Total Income: ₹{totalIncome.toFixed(2)}</div>

      {/* Form */}
      <form className="income-form" onSubmit={handleAddIncome}>
        <input
          type="text"
          placeholder="Income Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount in ₹"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button type="submit">Add Income</button>
      </form>

      {/* Income List */}
      <h3>Income History</h3>
      <ul className="income-list">
        {filteredIncome.length === 0 ? (
          <p>No income records found.</p>
        ) : (
          filteredIncome.map((item) => (
            <li key={item._id}>
              <div>
                <strong>{item.source}</strong> + ₹{item.amount}
                <button className="delete-btn" onClick={() => handleDelete(item._id)}>
                  Delete
                </button>
              </div>
              <small>{item.date}</small>
            </li>
          ))
        )}
      </ul>

      {/* Export Button */}
      <button
        className="export-btn"
        onClick={() => exportToCSV(filteredIncome, 'income.csv')}
      >
        Export to CSV
      </button>
    </div>
  );
};

export default Income;
