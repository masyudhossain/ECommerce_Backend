import asyncHandler from "express-async-handler";
import Category from "../models/category.model.js";
import Product from "../models/product.model.js";

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find();
    res.json(categories);
});

// @desc    Get products by category
// @route   GET /api/categories/:id/products
// @access  Public
export const getProductsByCategory = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const categoryId = req.params.id;
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
        res.status(404);
        throw new Error("Category not found");
    }

    const total = await Product.countDocuments({ category: categoryExists.name });
    const products = await Product.find({ category: categoryExists.name })
        .skip(skip)
        .limit(limit)
        .select("-reviews");

    res.json({
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        data: products,
    });
});
