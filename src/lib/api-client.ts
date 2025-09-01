import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { ApiError } from '../types';

// Create Axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management utilities
const getToken = (): string | null => {
  return localStorage.getItem(import.meta.env.VITE_JWT_STORAGE_KEY || 'auth_token');
};

const getRefreshToken = (): string | null => {
  return localStorage.getItem(import.meta.env.VITE_REFRESH_TOKEN_KEY || 'refresh_token');
};

const setTokens = (accessToken: string, refreshToken?: string): void => {
  localStorage.setItem(import.meta.env.VITE_JWT_STORAGE_KEY || 'auth_token', accessToken);
  if (refreshToken) {
    localStorage.setItem(import.meta.env.VITE_REFRESH_TOKEN_KEY || 'refresh_token', refreshToken);
  }
};

const clearTokens = (): void => {
  localStorage.removeItem(import.meta.env.VITE_JWT_STORAGE_KEY || 'auth_token');
  localStorage.removeItem(import.meta.env.VITE_REFRESH_TOKEN_KEY || 'refresh_token');
};

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling auth and errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Handle 401 errors - token refresh logic
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Try to refresh the token
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data;
        setTokens(accessToken, newRefreshToken);

        // Retry the original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Transform error to our ApiError type
    const apiError: ApiError = {
      message: (error.response?.data as any)?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
      code: (error.response?.data as any)?.code,
      details: (error.response?.data as any)?.details,
    };

    return Promise.reject(apiError);
  }
);

export { apiClient, setTokens, clearTokens, getToken, getRefreshToken };