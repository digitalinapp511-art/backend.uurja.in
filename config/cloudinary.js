import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME || "dqkssrvir",
  api_key: process.env.CLOUDINARY_KEY || "743432287259614",
  api_secret: process.env.CLOUDINARY_SECRET || "fi2uEXllhWr8eJ5OIZz3WOV22kQ",
});

//console.log("Cloudinary configured successfully", process.env.CLOUDINARY_NAME, process.env.CLOUDINARY_API_KEY, process.env.CLOUDINARY_API_SECRET);

export const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});