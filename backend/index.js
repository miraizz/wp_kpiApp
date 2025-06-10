const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

// Test general backend status
app.get('/api/test', (req, res) => {
    res.json({ message: 'Hello from Express backend (Mongoose enabled)!' });
});

// Test DB connection status (Mongoose specific)
app.get('/api/test-db', async (req, res) => {
    try {
        // Mongoose maintains the connection state.
        // `mongoose.connection.readyState` will be 1 if connected.
        if (Transaction.db.readyState === 1) { // Access connection state via any Mongoose model
            res.json({ status: 'connected', message: 'MongoDB connected via Mongoose.' });
        } else {
            res.status(500).json({ status: 'disconnected', message: 'MongoDB not connected via Mongoose.' });
        }
    } catch (err) {
        // This catch block might not be hit for connection errors, as connectDB handles it
        res.status(500).json({ error: err.message });
    }
});

// Get all transactions
app.get('/api/transactions', async (req, res) => {
    try {
        // Use the Mongoose model to find documents
        const transactions = await Transaction.find({});
        res.json(transactions);
    } catch (err) {
        console.error('Error fetching transactions:', err);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

// Add a new transaction
app.post('/api/transactions', async (req, res) => {
    try {
        const { description, amount, type, category } = req.body;

        // Basic server-side validation. Mongoose schema validation will also run.
        if (!description || !amount || !type || !category) {
            return res.status(400).json({ error: 'Please provide all required fields: description, amount, type, category.' });
        }

        // Create a new Mongoose document
        const newTransaction = new Transaction({
            description,
            amount,
            type,
            category
        });

        // Save the document to the database
        const savedTransaction = await newTransaction.save();
        res.status(201).json(savedTransaction); // Respond with 201 Created status and the saved document
    } catch (err) {
        console.error('Error adding transaction:', err);
        // Handle Mongoose validation errors
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: 'Failed to add transaction.' });
    }
});

// ---

app.listen(PORT, () => {
    console.log(`🚀 Backend running at http://localhost:${PORT}`);
});