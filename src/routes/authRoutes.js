// routes/authRoutes.js

import express from "express";
import { registerUser, loginUser, getUserProfile, getAllUsers, updateUserProfile, deleteUserAccount } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);
router.route("/profile")
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile)
    .delete(protect, deleteUserAccount);
router.get("/getUsers", protect, getAllUsers)

export default router;
