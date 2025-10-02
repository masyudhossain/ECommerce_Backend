// middleware/validateMiddleware.js
import asyncHandler from "express-async-handler";

const validateRequest = (schema) =>
    asyncHandler(async (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            res.status(400);
            throw new Error(error.details[0].message);
        }
        next();
    });

export default validateRequest;
