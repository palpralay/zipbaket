import axios from 'axios';

// Determine the base URL based on environment
const getBaseURL = () => {
  // In production, use the backend URL from environment variable
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_BACKEND_URL || 'https://zipbaket-backend.vercel.app';
  }
  
  // In development, use relative path (proxied by Vite)
  return '/';
};

// Create a configured axios instance
const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true, // ✓ Critical for sending cookies
  timeout: 30000, // 30 second timeout
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
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