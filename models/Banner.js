import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["hero", "flash"], // ✅ add this
    },

    title: {
      type: String,
      trim: true,
    },

    subtitle: {
      type: String,
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    redirectUrl: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Banner", bannerSchema);