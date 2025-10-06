// routes/adminProductRoutes.js

import express from "express";
import { createProduct, updateProduct, deleteProduct } from "../controllers/adminProductController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateMiddleware.js";
import { productCreateSchema, productUpdateSchema } from "../validators/adminProductValidator.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.post("/", validateRequest(productCreateSchema), createProduct);
router.patch("/:id", validateRequest(productUpdateSchema), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
