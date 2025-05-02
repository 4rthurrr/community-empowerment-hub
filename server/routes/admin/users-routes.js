const express = require("express");
const { getAllUsers } = require("../../controllers/admin/users-controller");

const router = express.Router();

// Get all users
router.get("/get", getAllUsers);

module.exports = router;
