import express from "express";
import { searchCustomers, getCustomers } from "../controllers/customerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/search", protect, searchCustomers);
router.get("/", protect, getCustomers);

export default router;

