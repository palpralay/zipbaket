import axios from 'axios';

// Create a configured axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // Enable cookies for authentication
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`Response: ${response.config.url} ${response.status}`);
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || error.message;
    console.error(`Response Error: ${error.config?.url} - ${message}`);
    return Promise.reject(error);
  }
);

export default axiosInstance;
