import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Get all users (Admin only)
router.get("/", protect, authorizeRoles("admin"), async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// Get own profile
router.get("/me", protect, async (req, res) => {
  res.json(req.user);
});

export default router;
