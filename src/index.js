// src/index.js  

import dotenv from "dotenv";
import connectDB from "./config/db.js";
import asyncHandler from "express-async-handler";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Start Server with DB connection
(asyncHandler(async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}))().catch((err) => {
    console.error(`Server startup failed: ${err.message}`);
    process.exit(1);
});
