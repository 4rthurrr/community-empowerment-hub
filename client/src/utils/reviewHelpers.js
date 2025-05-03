import axios from 'axios';

/**
 * Checks if a user can review a specific product
 * @param {string} userId - The ID of the user
 * @param {string} productId - The ID of the product
 * @returns {Promise<{canReview: boolean, message: string}>} - Object containing result and message
 */
export const checkCanReviewProduct = async (userId, productId) => {
  if (!userId || !productId) {
    return { 
      canReview: false, 
      message: "User or product information missing" 
    };
  }
  
  try {
    // Check if the user has purchased this product with a confirmed/delivered status
    const response = await axios.get(`/api/orders/can-review?userId=${userId}&productId=${productId}`);
    
    return {
      canReview: response.data.canReview,
      message: response.data.message
    };
  } catch (error) {
    console.error("Error checking review eligibility:", error);
    return {
      canReview: false,
      message: "Could not verify if you can review this product"
    };
  }
};

/**
 * Checks if a user has already reviewed a product
 * @param {string} userId - The ID of the user
 * @param {string} productId - The ID of the product
 * @returns {Promise<boolean>} - True if user has already reviewed
 */
export const hasUserReviewed = async (userId, productId) => {
  if (!userId || !productId) return false;
  
  try {
    const response = await axios.get(`/api/reviews/check?userId=${userId}&productId=${productId}`);
    return response.data.hasReviewed;
  } catch (error) {
    console.error("Error checking if user has reviewed:", error);
    return false;
  }
};
