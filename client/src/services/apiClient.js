import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Centralized Axios API client configured for cookie credentials and CSRF protection
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'X-RupeeWise-Client': 'web',
    'X-PaisaPilot-Client': 'web',
  },
  timeout: 15000,
});

// Response interceptor for consistent error extraction
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred';

    const normalizedError = new Error(message);
    normalizedError.statusCode = error.response?.status || 500;
    normalizedError.details = error.response?.data?.details || null;
    return Promise.reject(normalizedError);
  }
);

export default apiClient;
