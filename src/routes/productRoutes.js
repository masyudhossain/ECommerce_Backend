//routes/productRoutes.js

import express from "express";
import { getProducts, getProductById } from "../controllers/productController.js";

const router = express.Router();

// Guest-accessible routes
router.get("/", getProducts);
router.get("/:id", getProductById);


export default router;
