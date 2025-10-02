// src/app.js 

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import authRoutes from "./routes/authRoutes.js";
import seedAdmin from "./seeder/adminSeeder.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import productRoutes from "./routes/productRoutes.js";

const app = express();

// Middleware
app.use(express.json());

// Health Check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        timestamp: new Date(),
        message: "API is healthy",
    });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// 404 handler for unknown routes
app.use(notFound);

// Global error handler
app.use(errorHandler);


// Seed admin (non-production)
if (process.env.NODE_ENV !== "development") {
    seedAdmin()
        .then(() => console.log("Admin seeder checked"))
        .catch((err) => console.error("Admin seeder failed:", err));
}

export default app;
