const express = require("express");
const { getAllDonations } = require("../../controllers/admin/donations-controller");

const router = express.Router();

// Get all donations
router.get("/get", getAllDonations);

module.exports = router;
