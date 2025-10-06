// controllers/adminCategoryController.js

import asyncHandler from "express-async-handler";
import Category from "../models/category.model.js";
import Product from "../models/product.model.js";

// @desc    Create new category
// @route   POST /api/admin/categories
// @access  Admin
export const createCategory = asyncHandler(async (req, res) => {
    const { name, parentCategoryId } = req.body;

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
        res.status(400);
        throw new Error("Category already exists");
    }

    const category = new Category({ name, parentCategoryId });
    const createdCategory = await category.save();

    res.status(201).json(createdCategory);
});

// @desc    Update category
// @route   PUT /api/admin/categories/:id
// @access  Admin
export const updateCategory = asyncHandler(async (req, res) => {
    const { name, parentCategoryId } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
        res.status(404);
        throw new Error("Category not found");
    }

    category.name = name || category.name;
    category.parentCategoryId = parentCategoryId || category.parentCategoryId;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
});

// @desc    Delete category
// @route   DELETE /api/admin/categories/:id
// @access  Admin
export const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        res.status(404);
        throw new Error("Category not found");
    }

    // Find products in this category
    const productsInCategory = await Product.find({ category: category._id });

    if (productsInCategory.length > 0) {
        // Ensure "Uncategorized" exists
        let uncategorized = await Category.findOne({ name: "Uncategorized" });
        if (!uncategorized) {
            uncategorized = await Category.create({ name: "Uncategorized" });
            console.log('"Uncategorized" category created automatically during deletion');
        }

        // Reassign all products to "Uncategorized"
        await Product.updateMany(
            { category: category._id },
            { $set: { category: uncategorized._id } }
        );
    }

    await category.deleteOne();

    res.json({ message: "Category deleted and products reassigned if needed" });

});
