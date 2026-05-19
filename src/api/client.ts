import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import { secureStorage } from '../utils/secureStorage';
import { useAuthStore } from '../store/authStore';
import Constants from 'expo-constants';

const getBaseUrl = () => {
  const hostUri = Constants.expoConfig?.hostUri;

  // for web, we can just use localhost
  if (!hostUri) {
    return 'http://localhost:8080';
  }

  const ip = hostUri.split(':')[0];

  // For mobile, we need to use the IP address of the machine running the server
  return `http://${ip}:8080`;
};

// Create a single instance to use everywhere
const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000, // Abort request if it takes more than 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor - Add access token to requests
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const publicRoutes = ['/auth/login', '/auth/refresh', '/auth/register'];
    const isPublicRoute = publicRoutes.some((route) => config.url?.endsWith(route));
    const { accessToken } = useAuthStore.getState();

    if (accessToken && config.headers && !isPublicRoute) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - Handle token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = await secureStorage.getRefreshToken();

      if (!refreshToken) {
        // No refresh token available, logout
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }

      try {
        // Call refresh token endpoint
        const BASE_URL = getBaseUrl();
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

        // Update tokens in store and secure storage
        await secureStorage.saveTokens(newAccessToken, newRefreshToken);
        useAuthStore.getState().setTokens(newAccessToken, newRefreshToken);

        // Process queued requests
        processQueue(null, newAccessToken);

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, logout user
        processQueue(refreshError as AxiosError, null);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
