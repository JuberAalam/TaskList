import express from "express";
import { getProfile, updateProfile } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* ✅ FETCH PROFILE */
router.get("/me", authMiddleware, getProfile);

/* ✅ UPDATE PROFILE */
router.put("/me", authMiddleware, updateProfile);

export default router;
