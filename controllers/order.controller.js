import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import razorpay from "../config/razorpay.js";


/* ==================================
   PLACE ORDER
================================== */
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      fullName,
      email,
      phone,
      houseNo,
      landmark,
      city,
      state,
      pincode,
      country,
    } = req.body;

    if (!fullName || !phone || !houseNo || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // Prepare order items
    const orderItems = [];

    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);

      if (!product || product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product?.productName}`,
        });
      }

      // Reduce stock
      product.stock -= item.quantity;
      await product.save();

      orderItems.push({
        product: product._id,
        name: product.productName,
        images: product.images[0],
        quantity: item.quantity,
        price: item.price,
      });
    }

    const order = await Order.create({
      user: userId,
      items: orderItems,
      shippingAddress: {
        fullName,
        email,
        phone,
        houseNo,
        landmark,
        city,
        state,
        pincode,
        country: country || "India",
      },
      totalAmount: cart.totalAmount,
    });

    // Clear cart
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


export const buyNowOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      productId,
      quantity,
      fullName,
      email,
      phone,
      houseNo,
      landmark,
      city,
      state,
      pincode,
      country,
    } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Product and quantity required",
      });
    }

    if (!fullName || !phone || !houseNo || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const product = await Product.findById(productId);

    if (!product || product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    // reduce stock
    product.stock -= quantity;
    await product.save();

    const order = await Order.create({
      user: userId,
      items: [
        {
          product: product._id,
          name: product.productName,
          images: product.images[0],
          quantity: quantity,
          price: product.salePrice,
        },
      ],
      shippingAddress: {
        fullName,
        email,
        phone,
        houseNo,
        landmark,
        city,
        state,
        pincode,
        country: country || "India",
      },
      totalAmount: product.salePrice * quantity,
    });

    res.status(201).json({
      success: true,
      message: "Buy Now order placed successfully",
      data: order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};



/* ==================================
   GET USER ORDERS
================================== */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;

    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if cancellable
    if (
      order.orderStatus !== "Pending" &&
      order.orderStatus !== "Processing"
    ) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled at this stage",
      });
    }

    // Restore stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);

      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    // Update order status
    order.orderStatus = "Cancelled by User";

    // If payment done → mark refund pending
    if (order.paymentStatus === "Paid") {
      order.paymentStatus = "Refund Initiated";
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};



export const adminUpdateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const orderId = req.params.id;

    const allowedOrderStatus = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
      "Cancelled by User",   
      "Cancelled by Admin",
    ];

    const allowedPaymentStatus = [
      "Pending",
      "Paid",
      "Failed",
    ];

    const order = await Order.findById(orderId);
    console.log("Order found for update:", order); // Debug log

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Prevent changes after Delivered
    if (order.orderStatus === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Delivered order cannot be modified",
      });
    }

    // Validate order status
    if (orderStatus) {
      if (!allowedOrderStatus.includes(orderStatus)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order status",
        });
      }

      order.orderStatus = orderStatus;
    }

    // Validate payment status
    if (paymentStatus) {
      if (!allowedPaymentStatus.includes(paymentStatus)) {
        return res.status(400).json({
          success: false,
          message: "Invalid payment status",
        });
      }

      order.paymentStatus = paymentStatus;
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });

  } catch (error) {
    next(error);
  }
};

export const getAllOrdersAdmin = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      paymentStatus,
      search,
    } = req.query;

    const query = {};

    // Filter by order status
    if (status) {
      query.orderStatus = status;
    }

    // Filter by payment status
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    // Search by orderId or customer name
    if (search) {
      query.$or = [
        { _id: search },
        {
          "shippingAddress.fullName": {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const orders = await Order.find(query)
      .populate("user", "mobile")
      .populate("items.product", "productName")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalOrders = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      totalOrders,
      currentPage: Number(page),
      totalPages: Math.ceil(totalOrders / limit),
      data: orders,
    });

  } catch (error) {
    console.error("getAllOrdersAdmin error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};


//RozerPay
export const createRazorpayOrder = async (req, res) => {
  try {

    const { amount } = req.body;
    console.log("Amount:", amount);                          // ✅ check amount
    console.log("KEY:", process.env.RAZORPAY_KEY_ID);        // ✅ check key
    console.log("SECRET:", process.env.RAZORPAY_KEY_SECRET);

    const options = {
      amount: amount * 100, // paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      data: {
        order,
        key: process.env.RAZORPAY_KEY_ID,
      }
    });

  } catch (error) {
    console.error("Razorpay Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
      error: error.message
    });
  }
};
