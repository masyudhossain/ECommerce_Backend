// routes/adminProductRoutes.js

import express from "express";
import { createProduct, updateProduct, deleteProduct } from "../controllers/adminProductController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateMiddleware.js";
import { productSchema } from "../validators/adminProductValidator.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.post("/", validateRequest(productSchema), createProduct);
router.put("/:id", validateRequest(productSchema), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
