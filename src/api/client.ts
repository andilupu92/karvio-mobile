import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import { secureStorage } from '../utils/secureStorage';
import { useAuthStore } from '../store/authStore';
import Constants from 'expo-constants';

const getBaseUrl = () => {

  //prodction environment - use the environment variable
  if (!__DEV__) {
    return process.env.EXPO_PUBLIC_API_BASE_URL;
  }

  // development environment - construct the URL based on the host URI provided by Expo
  const hostUri = Constants.expoConfig?.hostUri;

  if (!hostUri) {
    return process.env.EXPO_PUBLIC_API_BASE_URL;
  }

  const ip = hostUri.split(':')[0];
  const port = process.env.EXPO_PUBLIC_API_PORT ?? '8080';
  return `http://${ip}:${port}`;
};

const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

// public routes that don't require auth token
const PUBLIC_ROUTES = ['/auth/login', '/auth/refresh', '/auth/register'];
const checkIsPublicRoute = (url?: string) => PUBLIC_ROUTES.some((route) => url?.endsWith(route));

// Request interceptor
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const isPublicRoute = checkIsPublicRoute(config.url);
    const { accessToken } = useAuthStore.getState();

    if (accessToken && config.headers && !isPublicRoute) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isPublicRoute = checkIsPublicRoute(originalRequest.url);

    // 1. check if error is 401, request hasn't been retried yet, and it's not a public route
    if (error.response?.status === 401 && !originalRequest._retry && !isPublicRoute) {
      
      if (isRefreshing) {
        // if we're already refreshing, queue the request and return a promise that resolves once the token is refreshed
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await secureStorage.getRefreshToken();

        if (!refreshToken) {
          useAuthStore.getState().logout();
          return Promise.reject(error);
        }

        const BASE_URL = getBaseUrl();
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const newAccessToken = response.data.newAccessToken;
        const newRefreshToken = response.data.newRefreshToken;

        await secureStorage.saveTokens(newAccessToken, newRefreshToken);
        useAuthStore.getState().setTokens(newAccessToken, newRefreshToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        // clear the queue with the new token
        processQueue(null, newAccessToken);

        return apiClient(originalRequest);
      } catch (refreshError) {
        // If the refresh fails (e.g., refresh token expired), clear the queue and log out
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