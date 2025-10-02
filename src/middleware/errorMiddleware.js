//middleware/errorMiddleware.js

// Handles errors thrown in asyncHandler wrapped controllers
export const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// Global error handler
export const errorHandler = (err, req, res, next) => {
    // Default to 500 server error if not set
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode);
    res.json({
        message: err.message,
        // stack trace only in development
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};
