import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

/* ==============================
   GET CART
============================== */
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId })
      .populate("items.product");

    if (!cart) {
      return res.status(200).json({
        success: true,
        data: { items: [], totalAmount: 0 },
      });
    }

    res.status(200).json({
      success: true,
      data: cart,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


/* ==============================
   ADD TO CART
============================== */
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.salePrice,
      });
    }

    // Recalculate total
    cart.totalAmount = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      data: cart,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
      console: console.log("Error in addToCart:", error),
    });
  }
};


/* ==============================
   UPDATE CART ITEM
============================== */
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      item => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    item.quantity = quantity;

    cart.totalAmount = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cart.save();

    res.status(200).json({
      success: true,
      data: cart,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


/* ==============================
   REMOVE ITEM
============================== */
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const cart = await Cart.findOne({ user: userId });

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    cart.totalAmount = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item removed",
      data: cart,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};