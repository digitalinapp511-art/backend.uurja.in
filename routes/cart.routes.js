import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.use(protect);

router.get("/", getCart);
router.post("/add", addToCart);
router.put("/update", updateCartItem);
router.delete("/remove", removeFromCart);

export default router;