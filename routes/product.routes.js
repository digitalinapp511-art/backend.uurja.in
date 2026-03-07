import express from "express";
import upload from "../middleware/upload.js";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

router.post("/", upload.array("images", 5), createProduct);
router.get("/getAll", getProducts);
router.get("/get/:id", getProductById);
router.put("/update/:id", upload.array("images", 5), updateProduct);
router.delete("/delete/:id", deleteProduct);

export default router;