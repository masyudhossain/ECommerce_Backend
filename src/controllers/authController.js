// controllers/authController.js

import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";
import { mergeGuestCart } from "./cartController.js";

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, addresses } = req.body;

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
        addresses: Array.isArray(addresses) ? addresses : [], // default empty array if not provided
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

// @desc    Get all users (admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password"); // Exclude password
    res.json(users);
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    // Update fields if provided
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
        user.password = req.body.password; // will be hashed via pre-save middleware
    }

    if (req.body.addresses) {
        user.addresses = req.body.addresses; // replace or merge as needed
    }

    const updatedUser = await user.save();

    res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        addresses: updatedUser.addresses,
        wishlist: updatedUser.wishlist,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
        token: generateToken(updatedUser._id), // refresh token
    });
});

// @desc    Delete user account
// @route   DELETE /api/auth/profile
// @access  Private
export const deleteUserAccount = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    await user.deleteOne(); // remove user from database

    res.json({ message: "Your account has been deleted successfully" });
});
