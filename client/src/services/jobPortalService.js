import axios from 'axios';

// Use a direct URL instead of process.env
const API_URL = 'http://localhost:5000/api';

// Export API_URL for use in components if needed
export { API_URL };

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

// Job endpoints
export const fetchAllJobs = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add each filter as a query parameter if it has a value
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.location) queryParams.append('location', filters.location);
    if (filters.category) queryParams.append('category', filters.category);
    
    const response = await axios.get(`${API_URL}/jobs?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

export const fetchJobById = async (jobId) => {
  try {
    const response = await axios.get(`${API_URL}/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching job ${jobId}:`, error);
    throw error;
  }
};

export const fetchMyJobs = async () => {
  try {
    console.log('Fetching my jobs with token:', localStorage.getItem('token') ? 'Present' : 'Missing');
    const response = await authAPI.get(`${API_URL}/jobs/user/me`);
    console.log('My jobs API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching my jobs:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
};

export const createJob = async (jobData) => {
  try {
    const response = await authAPI.post(`${API_URL}/jobs`, jobData);
    return response.data;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

export const updateJob = async (jobId, jobData) => {
  try {
    console.log('Sending update request for job ID:', jobId); // Debug log
    
    if (!jobId) {
      throw new Error('Job ID is required for update operation');
    }
    
    const response = await authAPI.put(`${API_URL}/jobs/${jobId}`, jobData);
    return response.data;
  } catch (error) {
    console.error(`Error updating job ${jobId}:`, error);
    throw error;
  }
};

export const deleteJob = async (jobId) => {
  try {
    console.log('Sending delete request for job ID:', jobId); // Debug log
    
    if (!jobId) {
      throw new Error('Job ID is required for delete operation');
    }
    
    const response = await authAPI.delete(`${API_URL}/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting job ${jobId}:`, error);
    throw error;
  }
};

// Application endpoints
export const applyForJob = async (jobId, applicationData) => {
  try {
    console.log('Applying for job with ID:', jobId); // Debug log
    
    if (!jobId) {
      throw new Error('Job ID is required for application submission');
    }
    
    // Handle both regular JSON data and FormData
    if (applicationData instanceof FormData) {
      const response = await fetch(`${API_URL}/jobs/${jobId}/applications`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: applicationData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Application submission failed');
      }
      
      return await response.json();
    } else {
      // Regular JSON data
      const response = await authAPI.post(`${API_URL}/jobs/${jobId}/applications`, applicationData);
      return response.data;
    }
  } catch (error) {
    console.error(`Error applying for job ${jobId}:`, error);
    throw error;
  }
};

export const fetchMyApplications = async () => {
  try {
    const response = await authAPI.get(`${API_URL}/applications/me`);
    return response.data;
  } catch (error) {
    console.error('Error fetching my applications:', error);
    throw error;
  }
};

export const fetchJobApplications = async (jobId) => {
  try {
    const response = await authAPI.get(`${API_URL}/jobs/${jobId}/applications`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching applications for job ${jobId}:`, error);
    throw error;
  }
};

export const updateApplicationStatus = async (applicationId, status) => {
  try {
    const response = await authAPI.put(`${API_URL}/applications/${applicationId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating application ${applicationId} status:`, error);
    throw error;
  }
};

export const withdrawApplication = async (applicationId) => {
  try {
    const response = await authAPI.delete(`${API_URL}/applications/${applicationId}`);
    return response.data;
  } catch (error) {
    console.error(`Error withdrawing application ${applicationId}:`, error);
    throw error;
  }
};
