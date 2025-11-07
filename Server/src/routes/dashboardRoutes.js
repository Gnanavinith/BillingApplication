import express from "express";
import { getDashboardStats, getWeeklySales } from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, getDashboardStats);
router.get("/weekly-sales", protect, getWeeklySales);

export default router;

