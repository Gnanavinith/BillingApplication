import express from "express";
import {
  createBill,
  getBills,
  getBillById,
  updateBillStatus,
  deleteBill,
} from "../controllers/billingController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("admin", "manager", "staff"), createBill);
router.get("/", protect, getBills);
router.get("/:id", protect, getBillById);
router.put("/:id/status", protect, authorizeRoles("admin", "manager"), updateBillStatus);
router.delete("/:id", protect, authorizeRoles("admin"), deleteBill);

export default router;

