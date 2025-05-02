const express = require("express");
const {
  createDonationIntent,
  processDonation,
  getSellerDonations,
  getBuyerDonations,
} = require("../../controllers/shop/donation-controller");

const router = express.Router();

// Create a payment intent for donation
router.post("/create-intent", createDonationIntent);

// Process a completed donation
router.post("/process", processDonation);

// Get donations received by a seller
router.get("/seller/:sellerId", getSellerDonations);

// Get donations made by a buyer
router.get("/buyer/:buyerId", getBuyerDonations);

module.exports = router;
