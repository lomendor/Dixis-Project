import axios from 'axios';
import { toast } from 'react-hot-toast';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    if (error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth';
      return Promise.reject(error);
    }

    const message = error.response?.data?.message || 'An error occurred';
    toast.error(message);
    return Promise.reject(error);
  }
);

export default api;