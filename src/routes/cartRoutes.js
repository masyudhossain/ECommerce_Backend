// routes/cartRoutes.js

import express from "express";
import {
    getCart,
    addToCart,
    removeFromCart,
    clearCart,
} from "../controllers/cartController.js";
import { ensureSession } from "../middleware/sessionMiddleware.js";

const router = express.Router();

// Cart endpoints (protect optional)
router.get("/", getCart); // guest cart auto handled by session cookie
router.post("/", addToCart);
router.delete("/:productId", removeFromCart);
router.delete("/", clearCart);

export default router;
