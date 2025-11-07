import express from "express";
import {
  getDealers,
  getDealerById,
  addDealer,
  updateDealer,
  deleteDealer,
} from "../controllers/dealerController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, getDealers);
router.get("/:id", protect, getDealerById);
router.post("/", protect, authorizeRoles("admin", "manager"), addDealer);
router.put("/:id", protect, authorizeRoles("admin", "manager"), updateDealer);
router.delete("/:id", protect, authorizeRoles("admin", "manager"), deleteDealer);

export default router;

