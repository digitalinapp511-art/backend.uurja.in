import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js"; 

import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import bannerRoutes from "./routes/banner.routes.js";
import adminRoutes from "./routes/admin.routes.js"; 
import firebaseRoutes from "./routes/firebase.routes.js"; 

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
      "https://uurja.in",
      "https://www.uurja.in"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// Connect Database
connectDB();



// Test Route
app.get("/api/test", (req, res) => {
  res.send("API is running...");
});



// Product Routes
app.use("/api/products", productRoutes);

// Cart Routes
app.use("/api/cart", cartRoutes);

// Order Routes
app.use("/api/orders", orderRoutes);

// Banner Routes
app.use("/api/banners", bannerRoutes);

// Admin Routes
app.use("/api/admin", adminRoutes);

// Firebase Routes
app.use("/api/firebase", firebaseRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});