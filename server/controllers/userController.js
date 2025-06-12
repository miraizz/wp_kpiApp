const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

// POST /api/signup //register
exports.signup = async (req, res) => {
    const { fullName, email, password, role, department, phone } = req.body;

    try {
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Generate unique short staffId
        let staffId;
        let exists = true;
        while (exists) {
            staffId = `STAFF-${Math.floor(1000 + Math.random() * 9000)}`; // e.g., STAFF-4821
            exists = await User.findOne({ staffId });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName,
            email: email.toLowerCase(),
            password: hashedPassword,
            role,
            department,
            phone,
            staffId
        });

        const userWithoutPassword = newUser.toObject();
        delete userWithoutPassword.password;

        res.status(201).json({ user: userWithoutPassword });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// POST /api/login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials (user not found)' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials (wrong password)' });
        }

        res.json({
            email: user.email,
            role: user.role,
            staffId: user.staffId,
            name: user.fullName
          });
          
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// GET /api/profile
exports.getProfile = async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const user = await User.findOne({ email }, { password: 0 });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (err) {
        console.error('Get profile error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// PUT /api/profile
exports.updateProfile = async (req, res) => {
    const { email, fullName, phone, department } = req.body;

    try {
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { fullName, phone, department },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user: updatedUser });
    } catch (err) {
        console.error('Update profile error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// DELETE /api/
exports.deleteUser = async (req, res) => {
    const { email } = req.body;

    try {
        const result = await User.findOneAndDelete({ email });

        if (!result) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'Account deleted successfully' });
    } catch (err) {
        console.error('Delete user error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};  

// PUT /api/password
exports.changePassword = async (req, res) => {
    const { email, currentPassword, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Current password is incorrect' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Password change error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};