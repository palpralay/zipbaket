import axios from 'axios';

// Create a configured axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000',
  withCredentials: true, // ✓ This is critical for sending cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Don't interfere with headers
axiosInstance.interceptors.request.use(
  (config) => {
    // Just log, don't modify anything
    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error.message);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || error.message;
    console.error(`❌ ${error.response?.status} ${error.config?.url} - ${message}`);
    return Promise.reject(error);
  }
);

export default axiosInstance;