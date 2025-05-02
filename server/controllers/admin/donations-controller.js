const Donation = require("../../models/Donation");
const mongoose = require("mongoose");

// Get all donations for admin
const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find({});

    res.status(200).json({
      success: true,
      data: donations,
    });
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch donations",
      error: error.message,
    });
  }
};

module.exports = {
  getAllDonations,
};
