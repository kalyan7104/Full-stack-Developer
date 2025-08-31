import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());


// Authentication Endpoints
app.post('/auth/google', (req, res) => {
  // TODO: Implement Google OAuth callback
  res.json({ message: 'Google OAuth callback' });
});

app.post('/auth/refresh', (req, res) => {
  // TODO: Implement JWT refresh
  res.json({ message: 'Refresh JWT token' });
});

app.post('/auth/logout', (req, res) => {
  // TODO: Implement logout
  res.json({ message: 'Logout user' });
});

app.get('/auth/profile', (req, res) => {
  // TODO: Return user profile
  res.json({ message: 'Get user profile' });
});

// Transaction Endpoints
app.post('/api/transactions/parse', (req, res) => {
  // TODO: Parse natural language input
  res.json({ message: 'Parse transaction input' });
});

app.post('/api/transactions', (req, res) => {
  // TODO: Create transaction
  res.json({ message: 'Create transaction' });
});

app.get('/api/transactions', (req, res) => {
  // TODO: Get transactions (with filters)
  res.json({ message: 'Get transactions' });
});

app.put('/api/transactions/:id', (req, res) => {
  // TODO: Update transaction
  res.json({ message: 'Update transaction' });
});

app.delete('/api/transactions/:id', (req, res) => {
  // TODO: Delete transaction
  res.json({ message: 'Delete transaction' });
});

// Analytics Endpoints
app.get('/api/analytics/summary', (req, res) => {
  // TODO: Financial summary
  res.json({ message: 'Financial summary' });
});

app.get('/api/analytics/categories', (req, res) => {
  // TODO: Spending by category
  res.json({ message: 'Spending by category' });
});

app.get('/api/analytics/trends', (req, res) => {
  // TODO: Spending trends
  res.json({ message: 'Spending trends' });
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
