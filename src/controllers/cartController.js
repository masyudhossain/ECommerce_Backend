// controller/cartController.js

import asyncHandler from "express-async-handler";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

// @desc    Get current cart
// @route   GET /api/cart
// @access  Public (guest) / Private (user)
export const getCart = asyncHandler(async (req, res) => {
    const sessionId = req.cookies?.guest_session || req.headers["x-session-id"];
    const userId = req.user?._id;

    if (userId) {
        // merge guest cart if exists
        if (sessionId) await mergeGuestCart(userId, sessionId);
        let cart = await Cart.findOne({ userId });
        if (!cart) cart = await Cart.create({ userId, items: [] });
        return res.json(cart);
    }

    if (!sessionId) return res.json({ items: [] });

    let cart = await Cart.findOne({ sessionId });
    if (!cart) cart = await Cart.create({ sessionId, items: [] });
    res.json(cart);
});

// @desc    Add product to cart
// @route   POST /api/cart
// @access  Public (guest) / Private (user)
export const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    const sessionId = req.cookies?.guest_session || req.headers["x-session-id"];
    const userId = req.user?._id;

    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    let cart;
    if (userId) {
        cart = await Cart.findOne({ userId });
        if (!cart) cart = await Cart.create({ userId, items: [] });
    } else {
        if (!sessionId) {
            res.status(400);
            throw new Error("Missing session ID");
        }
        cart = await Cart.findOne({ sessionId });
        if (!cart) cart = await Cart.create({ sessionId, items: [] });
    }

    const existingIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (existingIndex > -1) {
        cart.items[existingIndex].quantity += quantity;
    } else {
        cart.items.push({ productId, quantity, price: product.price });
    }

    await cart.save();
    res.status(201).json(cart);
});

// @desc    Remove product from cart
// @route   DELETE /api/cart/:productId
// @access  Public (guest) / Private (user)
export const removeFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const userId = req.user?._id || null;
    const sessionId = req.sessionId;

    const cart = await Cart.findOne({
        ...(userId ? { userId } : { sessionId }),
    });

    if (!cart) {
        res.status(404);
        throw new Error("Cart not found");
    }

    cart.items = cart.items.filter(
        (item) => item.productId.toString() !== productId
    );

    await cart.save();
    res.json(cart);
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Public (guest) / Private (user)
export const clearCart = asyncHandler(async (req, res) => {
    const userId = req.user?._id || null;
    const sessionId = req.sessionId;

    const cart = await Cart.findOne({
        ...(userId ? { userId } : { sessionId }),
    });

    if (!cart) {
        res.status(404);
        throw new Error("Cart not found");
    }

    cart.items = [];
    await cart.save();
    res.json(cart);
});


// Merge guest cart into user cart
export const mergeGuestCart = async (userId, sessionId) => {
    if (!sessionId) return;

    const guestCart = await Cart.findOne({ sessionId });
    if (!guestCart || guestCart.items.length === 0) return;

    let userCart = await Cart.findOne({ userId });
    if (!userCart) {
        userCart = await Cart.create({ userId, items: [] });
    }

    guestCart.items.forEach(guestItem => {
        const index = userCart.items.findIndex(i => i.productId.toString() === guestItem.productId.toString());
        if (index > -1) {
            // sum quantity
            userCart.items[index].quantity += guestItem.quantity;
        } else {
            userCart.items.push(guestItem);
        }
    });

    await userCart.save();
    await guestCart.deleteOne(); // remove guest cart
    return userCart;
};
