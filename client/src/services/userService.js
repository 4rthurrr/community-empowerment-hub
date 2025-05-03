import axios from 'axios';

const API_URL = 'http://localhost:5000/api/user';

// Create axios instance with auth header
const authAPI = axios.create({
  baseURL: API_URL,
  withCredentials: true // Important for cookies if using cookie auth
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

// Get user profile
export const getUserProfile = async () => {
  try {
    const response = await authAPI.get('/me');
    return response.data.user;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  try {
    const response = await authAPI.put('/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Update password
export const updatePassword = async (passwordData) => {
  try {
    const response = await authAPI.put('/password', passwordData);
    return response.data;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

// Deactivate account
export const deactivateAccount = async () => {
  try {
    const response = await authAPI.put('/deactivate');
    return response.data;
  } catch (error) {
    console.error('Error deactivating account:', error);
    throw error;
  }
};

// Upload profile image
export const uploadProfileImage = async (formData) => {
  try {
    const response = await authAPI.post('/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw error;
  }
};
