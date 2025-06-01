const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            family: 4,
            maxPoolSize: 10,
            minPoolSize: 5,
            retryWrites: true,
            w: 'majority',
            connectTimeoutMS: 30000,
            heartbeatFrequencyMS: 10000
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        console.error('Connection String:', process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@'));
        console.error('Please make sure:');
        console.error('1. Your IP address is whitelisted in MongoDB Atlas');
        console.error('2. The connection string is correct');
        console.error('3. The database user has correct permissions');
        process.exit(1);
    }
};

// Handle connection errors after initial connection
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected. Attempting to reconnect...');
    setTimeout(connectDB, 5000);
});

mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected successfully');
});

// Handle process termination
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
    } catch (err) {
        console.error('Error during MongoDB connection closure:', err);
        process.exit(1);
    }
});

module.exports = connectDB; 