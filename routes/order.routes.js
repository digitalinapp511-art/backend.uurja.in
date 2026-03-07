import express from "express";
import { protect } from "../middleware/auth.js";

import {
  placeOrder,
  getMyOrders,
  cancelOrder,
  adminUpdateOrderStatus,  // admin`s order status update controller
  getAllOrdersAdmin
} from "../controllers/order.controller.js";

const router = express.Router();

// router.use(protect);

router.post("/place", protect,  placeOrder);
router.get("/my-orders", protect, getMyOrders);
router.put("/cancel/:id", protect, cancelOrder);


// admin route

import { protectAdmin } from "../middleware/adminAuth.js";

router.put(
  "/admin/status/:id",
  protectAdmin,
  adminUpdateOrderStatus
);

/* Admin - Get all orders */
router.get("/admin/orders", protectAdmin, getAllOrdersAdmin);

export default router;