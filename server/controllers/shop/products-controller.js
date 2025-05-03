const Product = require("../../models/Product");

const getFilteredProducts = async (req, res) => {
  try {
    const { category = [], subcategory = [], brand = [], sortBy = "price-lowtohigh" } = req.query;

    let filters = {};

    if (category.length) {
      filters.category = { $in: category.split(",") };
    }

    if (subcategory.length) {
      filters.subcategory = { $in: subcategory.split(",") };
    }

    if (brand.length) {
      filters.brand = { $in: brand.split(",") };
    }

    let sort = {};

    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;

        break;
      case "price-hightolow":
        sort.price = -1;

        break;
      case "title-atoz":
        sort.title = 1;

        break;

      case "title-ztoa":
        sort.title = -1;

        break;

      default:
        sort.price = 1;
        break;
    }

    const products = await Product.find(filters).sort(sort);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (e) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

// Get products for the authenticated seller
const getSellerProducts = async (req, res) => {
  try {
    // Get the seller ID from the authenticated user
    const sellerId = req.user.id;

    // Find all products where seller matches the authenticated user
    const products = await Product.find({ seller: sellerId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (err) {
    console.error("Error fetching seller products:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch your products",
      error: err.message,
    });
  }
};

// Create a new product (seller only)
const createProduct = async (req, res) => {
  try {
    // Get seller ID from authenticated user
    const sellerId = req.user.id;

    // Verify user is a seller
    if (req.user.role !== "seller") {
      return res.status(403).json({
        success: false,
        message: "Only sellers can create products",
      });
    }

    // Create new product with seller reference
    const newProduct = new Product({
      ...req.body,
      seller: sellerId,
    });

    // Save the product
    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (err) {
    console.error("Error creating product:", err);

    // Handle validation errors
    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.keys(err.errors).map((key) => ({
          field: key,
          message: err.errors[key].message,
        })),
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: err.message,
    });
  }
};

// Update an existing product (seller only)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const sellerId = req.user.id;

    // Find the product
    const product = await Product.findById(id);

    // Check if product exists
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Verify ownership (seller can only update their own products)
    if (product.seller.toString() !== sellerId) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own products",
      });
    }

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(id, { ...req.body }, { new: true, runValidators: true });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (err) {
    console.error("Error updating product:", err);

    // Handle validation errors
    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.keys(err.errors).map((key) => ({
          field: key,
          message: err.errors[key].message,
        })),
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: err.message,
    });
  }
};

// Delete a product (seller only)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const sellerId = req.user.id;

    // Find the product
    const product = await Product.findById(id);

    // Check if product exists
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Verify ownership (seller can only delete their own products)
    if (product.seller.toString() !== sellerId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own products",
      });
    }

    // Delete the product
    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: err.message,
    });
  }
};

module.exports = {
  getFilteredProducts,
  getProductDetails,
  getSellerProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
