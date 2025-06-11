const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5050;

const User = require('./models/User');

// Connect to MongoDB using Mongoose
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected successfully with Mongoose!');
    } catch (err) {
        console.error('❌ MongoDB connection failed:', err);
        process.exit(1); // Exit if DB connection fails
    }
};

// Connect to the database on startup
mongoose.set('debug', true);
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/test', (req, res) => {
    console.log('✅ /api/test endpoint was hit');
    res.json({ message: 'Hello from Express backend (Mongoose enabled)!' });
});

// Health check for DB connection status
app.get('/api/test-db', (req, res) => {
    const state = mongoose.connection.readyState;
    const statusMap = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    res.json({
        status: statusMap[state],
        code: state
    });
});

app.post('/api/test-post', (req, res) => {
    console.log('✅ Test POST hit:', req.body);
    res.json({ ok: true });
});

app.post('/api/login', async (req, res) => {
    console.log('🔥 Received POST /api/login');
    console.log('📦 Request body:', req.body);

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email.toLowerCase() });

        console.log('🔍 Fetched user:', user);

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials (no user found)' });
        }

        if (user.password !== password) {
            console.log(`❌ Password mismatch: expected "${user.password}", got "${password}"`);
            return res.status(401).json({ error: 'Invalid credentials (wrong password)' });
        }

        console.log("✅ Login successful for:", user.email);
        res.json({ email: user.email, role: user.role });

    } catch (err) {
        console.error('❌ Login error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Start
app.listen(PORT, () => {
    console.log(`🚀 Backend running at http://localhost:${PORT}`);
});