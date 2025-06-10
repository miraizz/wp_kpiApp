require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Allow requests from React frontend
app.use(express.json());

// Sample route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Hello from Express backend!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});

const connectDB = require('./db');

app.get('/api/transactions', async (req, res) => {
    try {
        const db = await connectDB();
        const transactions = await db.collection('transactions').find({}).toArray();
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});
