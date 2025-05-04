// API configuration using Vite environment variables
const apiBaseUrl = import.meta.env.VITE_API_URL || '/api';

// Export the base URL for API calls
export const API_URL = apiBaseUrl;

// Export existing configuration
export * from './index';