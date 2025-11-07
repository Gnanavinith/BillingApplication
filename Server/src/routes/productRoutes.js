import express from "express";
import { getProducts, getProductById, addProduct, updateProduct, deleteProduct, updateStock } from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, getProducts);
router.get("/:id", protect, getProductById);
router.post("/", protect, authorizeRoles("admin", "manager"), addProduct);
router.put("/:id", protect, authorizeRoles("admin", "manager"), updateProduct);
router.delete("/:id", protect, authorizeRoles("admin", "manager"), deleteProduct);
router.patch("/:id/stock", protect, authorizeRoles("admin", "manager"), updateStock);

export default router;

