const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI; // Put this in .env file
const client = new MongoClient(uri);

async function connectDB() {
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB');
        return client.db(); // Return the DB instance
    } catch (err) {
        console.error('❌ Failed to connect to MongoDB:', err);
        throw err;
    }
}

module.exports = connectDB;