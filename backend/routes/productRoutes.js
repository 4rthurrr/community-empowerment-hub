const express = require('express');
const axios = require('axios'); // Add missing axios import
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct,
} = require('../Controllers/productController');

const instance = axios.create({
  baseURL: 'http://localhost:5000/api/', // Replace with your backend's base URL
  timeout: 5000, // Optional: Timeout for requests
  headers: {
    'Content-Type': 'application/json',
  },
});

const fetchProductById = async (id) => {
  try {
    const response = await instance.get(`/products/${id}`);
    return response.data; // Returns the product details
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};

const addProduct = async (productData) => {
  try {
    const response = await instance.post('/products', productData);
    return response.data; // Returns the created product
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// GET all products
router.get('/', getProducts);

// GET a product by ID
router.get('/:id', getProductById); // Add missing route

// POST a new product
router.post('/', createProduct);

// DELETE a product
router.delete('/:id', deleteProduct);

module.exports = router;
