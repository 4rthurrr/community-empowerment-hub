const Order = require("../../models/Order");
const Product = require("../../models/Product");
const ProductReview = require("../../models/Review");

const addProductReview = async (req, res) => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue } = req.body;

    // Validate required fields
    if (!productId || !userId || !reviewMessage || !reviewValue) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields for review",
      });
    }

    // Fixed order status check - properly check for confirmed or delivered status
    const order = await Order.findOne({
      userId,
      "cartItems.productId": productId,
      orderStatus: { $in: ["confirmed", "delivered"] },
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You need to purchase and receive the product before reviewing it.",
      });
    }

    // Fixed typo in variable name
    const checkExistingReview = await ProductReview.findOne({
      productId,
      userId,
    });

    if (checkExistingReview) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product!",
      });
    }

    const newReview = new ProductReview({
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue,
    });

    await newReview.save();

    const reviews = await ProductReview.find({ productId });
    const totalReviewsLength = reviews.length;
    const averageReview =
      reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
      totalReviewsLength;

    await Product.findByIdAndUpdate(productId, { averageReview });

    res.status(201).json({
      success: true,
      data: newReview,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Server error while processing your review",
    });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const reviews = await ProductReview.find({ productId });
    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Server error while retrieving reviews",
    });
  }
};

const checkUserReview = async (req, res) => {
  try {
    const { userId, productId } = req.query;

    if (!userId || !productId) {
      return res.status(400).json({
        hasReviewed: false,
        message: "Missing user ID or product ID",
      });
    }

    const existingReview = await ProductReview.findOne({
      productId,
      userId,
    });

    return res.status(200).json({
      hasReviewed: !!existingReview,
      reviewData: existingReview,
    });
  } catch (error) {
    console.error("Error checking if user has reviewed:", error);
    return res.status(500).json({
      hasReviewed: false,
      message: "Error checking review status",
    });
  }
};

module.exports = {
  addProductReview,
  getProductReviews,
  checkUserReview,
};
