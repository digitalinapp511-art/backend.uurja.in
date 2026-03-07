import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: ["Bracelet", "Ring", "Selenite Plate"],
      required: true,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
    },

    originalPrice: {
      type: Number,
      required: true,
    },

    salePrice: {
      type: Number,
      required: true,
      validate: {
        validator: function (value) {
          return value <= this.originalPrice;
        },
        message: "Sale price must be less than or equal to original price",
      },
    },

    description: {
      type: String,
      trim: true,
    },

    images: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

productSchema.index({ productName: "text" });

export default mongoose.model("Product", productSchema);