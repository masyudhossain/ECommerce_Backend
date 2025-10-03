// controllers/authController.js

import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";
import { mergeGuestCart } from "./cartController.js";

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        role: "customer",
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            addresses: user.addresses,
            wishlist: user.wishlist,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const sessionId = req.cookies?.guest_session || req.headers["x-session-id"];

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        if (sessionId) {
            await mergeGuestCart(user._id, sessionId);
        }
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            addresses: user.addresses,
            wishlist: user.wishlist,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            addresses: user.addresses,
            wishlist: user.wishlist,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});
