// controllers / productController.js

import asyncHandler from "express-async-handler";
import Product from "../models/product.model.js";
import Category from "../models/category.model.js";

// @desc    Get products with pagination, search, filter
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const category = req.query.category || "";
    const minPrice = Number(req.query.minPrice) || 0;
    const maxPrice = Number(req.query.maxPrice) || Number.MAX_SAFE_INTEGER;

    const query = {
        price: { $gte: minPrice, $lte: maxPrice },
        $or: [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
        ],
    };

    if (category) {
        if (category.match(/^[0-9a-fA-F]{24}$/)) {
            // If it's a valid ObjectId, use it directly
            query.category = category;
        } else {
            // If it's a name, find category by name
            const cat = await Category.findOne({ name: { $regex: category, $options: "i" } });
            if (cat) {
                query.category = cat._id;
            } else {
                return res.json({
                    page,
                    limit,
                    total: 0,
                    pages: 0,
                    data: [],
                });
            }
        }
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
        .skip(skip)
        .limit(limit)
        .populate("category", "name")
        .select("-reviews -user") // exclude reviews for listing
        .sort({ createdAt: -1 });

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
