const express = require('express');
const app = express();

const port = 5000;
const server = app.listen(port, () => {
  console.log(`Node Server listening on port ${port}`);
});

// Test the API
app.get('/', (req, res) => {
  res.status(200).json({ message: '😊 API is running...' });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Everything is good here 🎉' });
});

// Calculator routes
// Add two numbers
app.get('/add', (req, res) => {
  const { num1, num2 } = req.query;
  if (!num1 || !num2) {
    return res.status(400).json({ error: 'Please provide two numbers' });
  }
  const sum = parseFloat(num1) + parseFloat(num2);
  res.status(200).json({ result: sum });
});

// Subtract two numbers
app.get('/subtract', (req, res) => {
  const { num1, num2 } = req.query;
  if (!num1 || !num2) {
    return res.status(400).json({ error: 'Please provide two numbers' });
  }
  const difference = parseFloat(num1) - parseFloat(num2);
  res.status(200).json({ result: difference });
});

// Multiply two numbers
app.get('/multiply', (req, res) => {
  const { num1, num2 } = req.query;
  if (!num1 || !num2) {
    return res.status(400).json({ error: 'Please provide two numbers' });
  }
  const product = parseFloat(num1) * parseFloat(num2);
  res.status(200).json({ result: product });
});

// Divide two numbers
app.get('/divide', (req, res) => {
  const { num1, num2 } = req.query;
  if (!num1 || !num2) {
    return res.status(400).json({ error: 'Please provide two numbers' });
  }
  if (num2 == 0) {
    return res.status(400).json({ error: 'Cannot divide by zero' });
  }
  const quotient = parseFloat(num1) / parseFloat(num2);
  res.status(200).json({ result: quotient });
});

module.exports = { app, server };