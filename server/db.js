const mongoose = require('mongoose');
require('dotenv').config(); // Ensure dotenv is loaded here if MONGODB_URI is only defined in .env

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            // useNewUrlParser: true,  // These are often not needed in newer Mongoose versions
            // useUnifiedTopology: true, // as they are the default.
            // Check Mongoose docs for the latest recommendations.
        });
        console.log('✅ MongoDB connected successfully with Mongoose!');
    } catch (err) {
        console.error('❌ MongoDB connection failed:', err);
        process.exit(1); // Exit the process if the database connection fails
    }
};

module.exports = connectDB;