// middleware/sessionMiddleware.js

import { v4 as uuidv4 } from "uuid";

export const ensureSession = (req, res, next) => {
    let sessionId = req.cookies?.sessionId;

    if (!sessionId) {
        sessionId = uuidv4();
        res.cookie("sessionId", sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        });
    }

    req.sessionId = sessionId;
    next();
};
