import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // Replace with your backend's base URL
  timeout: 5000, // Optional: Timeout for requests
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
