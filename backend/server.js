// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Check the loaded URI
console.log("MONGO_URI:", process.env.MONGO_URI);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schemas
const incomeSchema = new mongoose.Schema({
  source: String,
  amount: Number,
  date: String,
  month: Number,
  year: Number
});

const expenseSchema = new mongoose.Schema({
  title: String,
  amount: Number,
  date: String,
  month: Number,
  year: Number
});

const Income = mongoose.model('Income', incomeSchema);
const Expense = mongoose.model('Expense', expenseSchema);

// Routes - Income
app.get('/api/income', async (req, res) => {
  try {
    const data = await Income.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch income data' });
  }
});

app.post('/api/income', async (req, res) => {
  try {
    const income = new Income(req.body);
    await income.save();
    res.status(201).json(income);
  } catch (err) {
    res.status(400).json({ error: 'Failed to save income' });
  }
});

app.delete('/api/income/:id', async (req, res) => {
  try {
    await Income.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete income' });
  }
});

// Routes - Expenses
app.get('/api/expenses', async (req, res) => {
  try {
    const data = await Expense.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

app.post('/api/expenses', async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: 'Failed to save expense' });
  }
});

app.delete('/api/expenses/:id', async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete expense' });
  }
});

// Server start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
