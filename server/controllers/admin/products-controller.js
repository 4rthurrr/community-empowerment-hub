const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");

const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtil(url);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error occured",
    });
  }
};

//add a new product
const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      subcategory,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    // Validate required fields
    if (!image || !title || !description || !category || !subcategory || !price || !totalStock) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields for product creation"
      });
    }

    // Handle numeric conversions
    const numericPrice = Number(price);
    const numericSalePrice = salePrice ? Number(salePrice) : 0;
    const numericTotalStock = Number(totalStock);
    
    if (isNaN(numericPrice) || isNaN(numericSalePrice) || isNaN(numericTotalStock)) {
      return res.status(400).json({
        success: false,
        message: "Price, Sale Price and Total Stock must be valid numbers"
      });
    }

    const newlyCreatedProduct = new Product({
      image,
      title,
      description,
      category,
      subcategory,
      brand,
      price: numericPrice,
      salePrice: numericSalePrice,
      totalStock: numericTotalStock,
      averageReview: averageReview || 0,
    });

    await newlyCreatedProduct.save();
    res.status(201).json({
      success: true,
      data: newlyCreatedProduct,
    });
  } catch (e) {
    console.log("Error adding product:", e);
    if (e.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation error: " + e.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error occurred while adding product",
    });
  }
};

//fetch all products

const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts = await Product.find({});
    res.status(200).json({
      success: true,
      data: listOfProducts,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//edit a product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      title,
      description,
      category,
      subcategory,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    let findProduct = await Product.findById(id);
    if (!findProduct)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    // Handle numeric conversions safely
    const numericPrice = price !== undefined && price !== "" ? Number(price) : findProduct.price;
    const numericSalePrice = salePrice !== undefined && salePrice !== "" ? Number(salePrice) : findProduct.salePrice;
    const numericTotalStock = totalStock !== undefined && totalStock !== "" ? Number(totalStock) : findProduct.totalStock;
    
    if (isNaN(numericPrice) || isNaN(numericSalePrice) || isNaN(numericTotalStock)) {
      return res.status(400).json({
        success: false,
        message: "Price, Sale Price and Total Stock must be valid numbers"
      });
    }

    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.subcategory = subcategory || findProduct.subcategory;
    findProduct.price = numericPrice;
    findProduct.salePrice = numericSalePrice;
    findProduct.totalStock = numericTotalStock;
    findProduct.image = image || findProduct.image;
    findProduct.averageReview = averageReview !== undefined ? Number(averageReview) : findProduct.averageReview;

    await findProduct.save();
    res.status(200).json({
      success: true,
      data: findProduct,
    });
  } catch (e) {
    console.log("Error editing product:", e);
    if (e.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation error: " + e.message,
      });
    }
    if (e.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error occurred while editing product",
    });
  }
};

//delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    res.status(200).json({
      success: true,
      message: "Product delete successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};