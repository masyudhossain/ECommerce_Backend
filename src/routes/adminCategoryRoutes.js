// routes/adminCategoryRoutes.js

import express from "express";
import { createCategory, updateCategory, deleteCategory } from "../controllers/adminCategoryController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateMiddleware.js";
import { categorySchema } from "../validators/adminCategoryValidator.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.post("/", validateRequest(categorySchema), createCategory);
router.put("/:id", validateRequest(categorySchema), updateCategory);
router.delete("/:id", deleteCategory);

export default router;
