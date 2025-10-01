//  middleware/authMiddleware.js

import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";

// Middleware: protect routes (must be logged in)
const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user to request (excluding password)
            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                res.status(401);
                throw new Error("User not found");
            }

            next();
        } catch (err) {
            console.error(err);
            res.status(401);
            throw new Error("Not authorized, invalid token");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token provided");
    }
});

// Middleware: role-based authorization
const authorize =
    (...roles) =>
        (req, res, next) => {
            if (!roles.includes(req.user.role)) {
                res.status(403);
                throw new Error("Forbidden: insufficient permissions");
            }
            next();
        };

export { protect, authorize };
