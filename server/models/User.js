const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['seller', 'buyer', 'admin'],
    default: "buyer",
  },
  // Add profile-related fields
  profileImage: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    default: "",
  },
  interestedCategories: {
    type: [String],
    default: [],
  },
  // Add notification preferences
  emailNotifications: {
    type: Boolean,
    default: true,
  },
  orderUpdates: {
    type: Boolean,
    default: true,
  },
  promotions: {
    type: Boolean,
    default: false,
  },
  newsletter: {
    type: Boolean,
    default: false,
  },
  // Add timestamps for created/updated
  isActive: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
module.exports = User;
