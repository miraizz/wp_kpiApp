// models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: { // e.g., 'income', 'expense'
        type: String,
        required: true,
        enum: ['income', 'expense'] // Ensures only these values are allowed
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now // Automatically sets the current date
    }
});

// Create the model from the schema
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;