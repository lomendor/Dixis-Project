import axios from 'axios';
import { handleApiError, showErrorToast } from '@/utils/errorHandling';
import { ERROR_MESSAGES } from '@/types/errors';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001') + '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const authStorage = JSON.parse(localStorage.getItem('auth-storage') || '{}');
    const token = authStorage.state?.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(handleApiError(error))
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const authStorage = JSON.parse(localStorage.getItem('auth-storage') || '{}');
        const refreshToken = authStorage.state?.refreshToken;
        
        if (!refreshToken) {
          throw error;
        }

        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken
        });

        const { token } = response.data;
        const newAuthStorage = {
          ...authStorage,
          state: {
            ...authStorage.state,
            token
          }
        };
        localStorage.setItem('auth-storage', JSON.stringify(newAuthStorage));
        originalRequest.headers.Authorization = `Bearer ${token}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('auth-storage');
        window.location.href = '/login';
        return Promise.reject(handleApiError(refreshError));
      }
    }

    // Handle 404 errors
    if (error.response?.status === 404) {
      return Promise.reject({
        code: 'NOT_FOUND',
        message: ERROR_MESSAGES.NOT_FOUND
      });
    }

    const apiError = handleApiError(error);
    showErrorToast(apiError);
    return Promise.reject(apiError);
  }
);