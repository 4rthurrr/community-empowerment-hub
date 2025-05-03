const express = require("express");
const router = express.Router();
const {
  addProductReview,
  getProductReviews,
  checkUserReview,
} = require("../../controllers/shop/product-review-controller");

// Add a review
router.post("/", addProductReview);

// Get reviews for a product
router.get("/:productId", getProductReviews);

// Check if user has reviewed a product
router.get("/check", checkUserReview);

module.exports = router;
