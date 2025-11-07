import express from "express";
import {
  getSalesReport,
  getProfitLossReport,
  getStockReport,
} from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/sales", protect, authorizeRoles("admin", "manager", "staff"), getSalesReport);
router.get("/profit-loss", protect, authorizeRoles("admin", "manager"), getProfitLossReport);
router.get("/stock", protect, authorizeRoles("admin", "manager", "staff"), getStockReport);

export default router;

