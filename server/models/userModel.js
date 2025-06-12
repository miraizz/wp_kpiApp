const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
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
    },
    department: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('User', userSchema, 'users');