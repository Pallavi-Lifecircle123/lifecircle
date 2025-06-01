const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Session = require('../models/Session');

// Register new user
const register = async (req, res) => {
    try {
        const { email, password, role, name, phone, address } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Create new user
        const user = new User({
            email,
            password,
            role,
            name,
            phone,
            address
        });

        await user.save();

        // Create session
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        const session = new Session({
            userId: user._id,
            token,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            deviceInfo: req.headers['user-agent'],
            ipAddress: req.ip
        });

        await session.save();

        res.status(201).json({
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                name: user.name
            },
            token
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Create session
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        const session = new Session({
            userId: user._id,
            token,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            deviceInfo: req.headers['user-agent'],
            ipAddress: req.ip
        });

        await session.save();

        res.json({
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                name: user.name
            },
            token
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Logout user
const logout = async (req, res) => {
    try {
        await Session.findOneAndDelete({ token: req.session.token });
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get current user
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    register,
    login,
    logout,
    getCurrentUser
}; 