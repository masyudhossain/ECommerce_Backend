// controllers / productController.js

import asyncHandler from "express-async-handler";
import Product from "../models/product.model.js";

// @desc    Get all products (with pagination)
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Product.countDocuments();
    const products = await Product.find()
        .skip(skip)
        .limit(limit)
        .select("-reviews"); // exclude reviews for listing

    res.json({
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        data: products,
    });
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate("reviews.user", "name email");

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
});
