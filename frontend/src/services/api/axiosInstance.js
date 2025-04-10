// api/axiosInstance.ts
import axios from 'axios';
import { toast } from 'react-toastify';
require('dotenv').config();

const axiosInstance = axios.create({
  baseURL: process.env.API_URL,
  timeout: 5000,
});

// Request interceptor: attach token if available.
axiosInstance.interceptors.request.use(
  config => {
    // Example: get token from localStorage or Recoil snapshot.
    const token = localStorage.getItem('token');
    if (token) config.headers.authorization = token;
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor: handle errors globally.
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // Example: detect offline toggles or status
    if (error.response && error.response.status === 503) {
      toast.error('Device is offline. Action cannot be completed.');
    }
    return Promise.reject(error);
  }
);

module.exports = axiosInstance;
