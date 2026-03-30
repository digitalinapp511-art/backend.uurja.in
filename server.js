import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import bannerRoutes from "./routes/banner.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import firebaseRoutes from "./routes/firebase.routes.js";

dotenv.config();

const app = express();

// ESM-safe __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Frontend build path on Hostinger
// server.js is in: /domains/uurja.in/nodejs
// frontend is in:   /domains/uurja.in/public_html
const FRONTEND_DIR = path.join(__dirname, "../public_html");

// Middleware
app.use(
  cors({
    origin: ["https://uurja.in", "https://www.uurja.in", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

// Connect Database
connectDB();

// API Health Route
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/firebase", firebaseRoutes);

// Serve frontend static files
app.use(express.static(FRONTEND_DIR));

// SPA fallback (important for /product/:id shared links)
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "index.html"));
});


// 404 for unknown API routes
app.all(/^\/api\/.*/, (req, res) => {
  res.status(404).json({ success: false, message: "API route not found" });
});


// Basic error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// PORT
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
