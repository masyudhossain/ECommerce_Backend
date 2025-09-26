import express from 'express';
import dotenv from 'dotenv';

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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
