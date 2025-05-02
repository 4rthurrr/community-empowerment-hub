const Donation = require("../../models/Donation");
const User = require("../../models/User");
const { initStripe } = require("../../helpers/stripe");

// Create a payment intent with Stripe
const createDonationIntent = async (req, res) => {
  try {
    const { sellerId, buyerId, amount } = req.body;
    
    if (!sellerId || !buyerId || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid donation data. Please provide sellerId, buyerId, and a positive amount.",
      });
    }

    // Verify both seller and buyer exist
    const seller = await User.findById(sellerId);
    const buyer = await User.findById(buyerId);
    
    if (!seller || !buyer) {
      return res.status(404).json({
        success: false,
        message: "Seller or buyer not found",
      });
    }

    // Convert amount to cents for Stripe
    const amountInCents = Math.round(amount * 100);
    
    // Initialize Stripe
    const stripe = initStripe();
    
    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "lkr",
      metadata: {
        sellerId,
        buyerId,
        type: "donation"
      },
    });

    // Return the client secret to the frontend
    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error("Error creating donation intent:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create donation intent",
      error: error.message,
    });
  }
};

// Process successful donation
const processDonation = async (req, res) => {
  try {
    const { paymentIntentId, sellerId, buyerId, buyerEmail, amount, message } = req.body;
    
    if (!paymentIntentId || !sellerId || !buyerId || !amount) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Create a new donation record
    const newDonation = new Donation({
      sellerId,
      buyerId,
      buyerEmail,
      amount,
      message: message || "",
      status: "completed",
      stripePaymentId: paymentIntentId,
    });

    // Save the donation
    await newDonation.save();

    res.status(201).json({
      success: true,
      message: "Donation processed successfully",
      data: newDonation,
    });
  } catch (error) {
    console.error("Error processing donation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process donation",
      error: error.message,
    });
  }
};

// Get donation history for a seller
const getSellerDonations = async (req, res) => {
  try {
    const { sellerId } = req.params;
    
    const donations = await Donation.find({ 
      sellerId, 
      status: "completed" 
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: donations,
    });
  } catch (error) {
    console.error("Error fetching seller donations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch donations",
      error: error.message,
    });
  }
};

// Get donation history for a buyer
const getBuyerDonations = async (req, res) => {
  try {
    const { buyerId } = req.params;
    
    const donations = await Donation.find({ 
      buyerId, 
      status: "completed" 
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: donations,
    });
  } catch (error) {
    console.error("Error fetching buyer donations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch donations",
      error: error.message,
    });
  }
};

module.exports = {
  createDonationIntent,
  processDonation,
  getSellerDonations,
  getBuyerDonations,
};
