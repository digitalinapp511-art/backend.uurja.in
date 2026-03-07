import Product from "../models/Product.js";

/* ===============================
   CREATE PRODUCT
================================= */
export const createProduct = async (req, res) => {
  try {
    const {
      productName,
      category,
      stock,
      originalPrice,
      salePrice,
      description,
    } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image required",
      });
    }

    const imageUrls = req.files.map(file => file.path);

    const product = await Product.create({
      productName,
      category,
      stock,
      originalPrice,
      salePrice,
      description,
      images: imageUrls,
    });

    res.status(201).json({
      success: true,
      data: product,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


/* ===============================
   GET ALL PRODUCTS (Pagination + Search)
================================= */
export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;

    const query = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      data: products,
    });

  } catch (error) {
   res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


/* ===============================
   GET SINGLE PRODUCT
================================= */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


/* ===============================
   UPDATE PRODUCT
================================= */
// export const updateProduct = async (req, res) => {
//   try {
//     const updateData = { ...req.body };

//     if (req.files && req.files.length > 0) {
//       updateData.images = req.files.map(file => file.path);
//     }

//     const product = await Product.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true, runValidators: true }
//     );

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: product,
//     });

//   } catch (error) {
//    res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };


export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Merge existing + new values
    const updatedData = {
      ...product.toObject(),
      ...req.body,
    };

    // Manual validation
    if (
      Number(updatedData.salePrice) >
      Number(updatedData.originalPrice)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Sale price must be less than or equal to original price",
      });
    }

    if (req.files && req.files.length > 0) {
      updatedData.images = req.files.map(file => file.path);
    }

    Object.assign(product, updatedData);

    await product.save();

    res.status(200).json({
      success: true,
      data: product,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===============================
   DELETE PRODUCT
================================= */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};