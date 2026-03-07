import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: String,
    quantity: Number,
    price: Number,
  },
  { _id: false }
);

const shippingSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: String,
    phone: { type: String, required: true },

    houseNo: { type: String, required: true },
    landmark: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: "India" },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [orderItemSchema],

    shippingAddress: shippingSchema,

    totalAmount: {
      type: Number,
      required: true,
    },

    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    paymentMethod: {
  type: String,
  enum: [
        "cash_on_delivery",
        "upi",
        "credit_debit_card",
        "net_banking",
        "wallets"
      ],
  default: "cash_on_delivery",
},
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);