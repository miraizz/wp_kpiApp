const User = require('../models/userModel');

// Signup controller
exports.signup = async (req, res) => {
    const { fullName, email, password, role, department, phone } = req.body;

    try {
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const newUser = await User.create({
            fullName,
            email: email.toLowerCase(),
            password,
            role,
            department,
            phone
        });

        res.status(201).json({ user: newUser });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Login controller
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({ email: user.email, role: user.role });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};
