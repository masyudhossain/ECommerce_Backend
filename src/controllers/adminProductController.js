// controllers/adminProductController.js

import asyncHandler from "express-async-handler";
import Product from "../models/product.model.js";
import Category from "../models/category.model.js";

// @desc    Create new product (Admin)
// @route   POST /api/admin/products
// @access  Admin
export const createProduct = asyncHandler(async (req, res) => {
    const { name, description, price, brand, category, countInStock, images } = req.body;

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
        res.status(404);
        throw new Error("Category not found");
    }

    const product = new Product({
        name,
        description,
        price,
        brand,
        category,
        countInStock,
        images,
        user: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// @desc    Update product (Admin)
// @route   PUT /api/admin/products/:id
// @access  Admin
export const updateProduct = asyncHandler(async (req, res) => {
    const { name, description, price, brand, category, countInStock, images } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    if (category) {
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            res.status(404);
            throw new Error("Category not found");
        }
        product.category = category;
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price ?? product.price;
    product.brand = brand || product.brand;
    product.countInStock = countInStock ?? product.countInStock;
    product.images = images || product.images;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
});

// @desc    Delete product (Admin)
// @route   DELETE /api/admin/products/:id
// @access  Admin
export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }
    await product.remove();
    res.json({ message: "Product removed" });
});
