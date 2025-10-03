// controller/cartController.js

import asyncHandler from "express-async-handler";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

// @desc    Get current cart
// @route   GET /api/cart
// @access  Public (guest) / Private (user)
export const getCart = asyncHandler(async (req, res) => {
    const userId = req.user?._id || null;
    const sessionId = req.sessionId;

    let cart = await Cart.findOne({
        ...(userId ? { userId } : { sessionId }),
    }).populate("items.productId", "name price images");

    if (!cart) {
        cart = await Cart.create({
            userId: userId || null,
            sessionId: userId ? null : sessionId,
            items: [],
        });
    }

    res.json(cart);
});

// @desc    Add product to cart
// @route   POST /api/cart
// @access  Public (guest) / Private (user)
export const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    const qty = Number(quantity) || 1;
    const userId = req.user?._id || null;
    const sessionId = req.sessionId;

    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    let cart = await Cart.findOne({
        ...(userId ? { userId } : { sessionId }),
    });

    if (!cart) {
        cart = await Cart.create({
            userId: userId || null,
            sessionId: userId ? null : sessionId,
            items: [],
        });
    }

    const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
        cart.items[itemIndex].quantity += qty;
    } else {
        cart.items.push({
            productId,
            quantity: qty,
            price: product.price,
        });
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
