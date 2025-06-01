const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
// Remove serverless-http as it's not used for EC2 deployment
// const serverless = require('serverless-http');
const authRoutes = require('./routes/auth');
const requestRoutes = require('./routes/requests');
const volunteerRoutes = require('./routes/volunteers');

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
    origin: ['https://thelifecircle.ca', 'https://api.thelifecircle.ca', 'https://beta.thelifecircle.ca', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// MongoDB Connection with improved error handling
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Increase timeout if needed
            socketTimeoutMS: 45000,
            retryWrites: true,
            w: 'majority',
            maxPoolSize: 10,
            minPoolSize: 5,
            maxIdleTimeMS: 30000,
            connectTimeoutMS: 10000, // Increase timeout if needed
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Handle connection errors after initial connection
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected. Attempting to reconnect...');
            // Consider a more robust reconnection strategy for production
             setTimeout(connectDB, 5000); 
        });

        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected successfully');
        });

    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        console.log('Connection String:', process.env.MONGODB_URI ? process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@') : 'Not configured');
        console.log('Please make sure:');
        console.log('1. Your IP address is whitelisted in MongoDB Atlas');
        console.log('2. The connection string is correct in your .env file');
        console.log('3. The database user has correct permissions');
        // Exit if database connection fails on startup
        // process.exit(1); // Uncommenting this can prevent server from running without DB
    }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/volunteers', volunteerRoutes);

// Basic route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Welcome to The Life Circle API',
        version: '1.0.0',
        status: 'active',
        domain: req.headers.host // Use req.headers.host to show the domain accessed
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        domain: req.headers.host // Use req.headers.host to show the domain accessed
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
const PORT = process.env.PORT || 3000;

// Connect to MongoDB before starting the server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to MongoDB, server not started:', err.message);
});

// Removed Lambda handler as it's not for EC2 deployment
// module.exports.handler = async (event, context) => { ... }; 