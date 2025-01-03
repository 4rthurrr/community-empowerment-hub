const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  productName: { type: String, required: true },
  category: {
    type: String,
    required: true,
  },
  price: { type: Number, required: true },
  images: { type: [String], required: true },
});

module.exports = mongoose.model("Product", productSchema);
