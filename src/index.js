import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import asyncHandler from 'express-async-handler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

//Health Check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date(),
        message: 'API is healthy'
    });
});

(asyncHandler(async () => {
    // Connect to MongoDB
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}))().catch(err => {
    console.error(`Server startup failed: ${err.message}`);
    process.exit(1);
});
