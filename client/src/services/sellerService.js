import axios from 'axios';
import { API_URL } from '../config/apiConfig';

// Create axios instance with auth header
const authAPI = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

// Add auth token to requests
authAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fetch products for the authenticated seller
export const fetchSellerProducts = async () => {
  try {
    const response = await authAPI.get('/shop/products/seller');
    return response.data;
  } catch (error) {
    console.error('Error fetching seller products:', error);
    throw error;
  }
};

// Add a new product as a seller
export const addSellerProduct = async (productData) => {
  try {
    const response = await authAPI.post('/shop/products', productData);
    return response.data;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// Update a seller's product
export const updateSellerProduct = async (productId, productData) => {
  try {
    const response = await authAPI.put(`/shop/products/${productId}`, productData);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete a seller's product
export const deleteSellerProduct = async (productId) => {
  try {
    const response = await authAPI.delete(`/shop/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Additional seller account related services

// Get seller dashboard stats
export const getSellerStats = async () => {
  try {
    const response = await authAPI.get('/shop/seller/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching seller stats:', error);
    throw error;
  }
};

// Get seller orders
export const getSellerOrders = async (status = '') => {
  try {
    const url = status ? `/shop/seller/orders?status=${status}` : '/shop/seller/orders';
    const response = await authAPI.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    throw error;
  }
};

// Update order status (for seller)
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await authAPI.put(`/shop/seller/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};
