const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const kpiRoutes = require('./routes/kpiRoutes');
const User = require('./models/userModel');

dotenv.config();
const PORT = process.env.PORT || 5050;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.set('debug', true);
mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('✅ MongoDB connected successfully!');
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('📚 Collections:', collections.map(c => c.name));
        console.log('🔧 User collection:', User.collection.name);
    })
    .catch(err => {
        console.error('❌ DB connection failed:', err);
        process.exit(1);
    });

// Routes
app.use('/api', userRoutes);
app.use('/api/kpi', kpiRoutes);

// Test routes
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working' });
});

app.get('/api/test-db', (req, res) => {
    const statusMap = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    res.json({ status: statusMap[mongoose.connection.readyState] });
});

app.get('/api/debug', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'debug failed' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
