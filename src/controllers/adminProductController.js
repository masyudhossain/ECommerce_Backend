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
    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true, context: 'query' } // important for partial updates
    );

    if (!updatedProduct) {
        res.status(404);
        throw new Error("Product not found");
    }

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
    await product.deleteOne();
    res.json({ message: "Product removed" });
});
