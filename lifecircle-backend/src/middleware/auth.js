const jwt = require('jsonwebtoken');
const Session = require('../models/Session');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            throw new Error();
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find session
        const session = await Session.findOne({ 
            token,
            userId: decoded.userId,
            expiresAt: { $gt: new Date() }
        });

        if (!session) {
            throw new Error();
        }

        // Find user
        const user = await User.findById(decoded.userId);
        if (!user) {
            throw new Error();
        }

        // Update last activity
        session.lastActivity = new Date();
        await session.save();

        // Attach user and session to request
        req.user = user;
        req.session = session;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate.' });
    }
};

module.exports = auth; 