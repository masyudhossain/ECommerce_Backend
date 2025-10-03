// routes/cartRoutes.js

import express from "express";
import {
    getCart,
    addToCart,
    removeFromCart,
    clearCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Cart endpoints (protect optional)
router.get("/", protect, getCart); // guest cart auto handled by session cookie
router.post("/", protect, addToCart);
router.delete("/:productId", protect, removeFromCart);
router.delete("/", protect, clearCart);

export default router;
