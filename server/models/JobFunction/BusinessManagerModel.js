const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BusinessManagerSchema = new Schema({
  managerID: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("BusinessManager", BusinessManagerSchema);