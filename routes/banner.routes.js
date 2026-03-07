import express from "express";
import upload from "../middleware/upload.js";
import { protectAdmin } from "../middleware/adminAuth.js";
import {
  createBanner,
  getActiveBanners,
  getAllBanners,
  updateBanner,
  deleteBanner,
} from "../controllers/banner.controller.js";

const router = express.Router();

/* Public */
router.get("/", getActiveBanners);

/* Admin */
router.post("/", protectAdmin, upload.single("image"), createBanner);
router.get("/admin", protectAdmin, getAllBanners);
router.put("/update/:id", protectAdmin, upload.single("image"), updateBanner);
router.delete("/delete/:id", protectAdmin, deleteBanner);

export default router;