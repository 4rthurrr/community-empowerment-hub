const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Add a new product
router.post('/', async (req, res) => {
  try {
    const { productName, category, price, images } = req.body;
    const newProduct = new Product({ productName, category, price, images });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Failed to add product', error });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products', error });
  }
});

module.exports = router;
