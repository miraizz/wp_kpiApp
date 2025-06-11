const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Manager', 'Staff'],
        default: 'Staff'
    }
});

module.exports = mongoose.model('User', userSchema, 'users');