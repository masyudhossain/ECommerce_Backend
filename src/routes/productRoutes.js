//routes/productRoutes.js

import express from "express";
import { getProducts, getProductById, getCategories } from "../controllers/productController.js";

const router = express.Router();

// Guest-accessible routes
router.get("/", getProducts);
router.get("/:id", getProductById);
router.get("/categories/list", getCategories);

export default router;
