import apiClient from '../client';

const API_URL = '/auth';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  me: async () => {
    const response = await apiClient.get(`${API_URL}/me`);
    return response.data;
  },

  signUp: async (credentials: LoginCredentials) => {
    const response = await apiClient.post(`${API_URL}/register`, credentials);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(`${API_URL}/login`, credentials);
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post(`${API_URL}/refreshToken`, { refreshToken });
    return response.data;
  },

  deleteAccount: async () => {
    const response = await apiClient.delete(`${API_URL}/delete`);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await apiClient.post(`${API_URL}/forgot-password`, { email });
    return response.data;
  },

  verifyOtp: async (email: string, otpCode: string) => {
    const response = await apiClient.post(`${API_URL}/verify-otp`, { email, otpCode });
    return response.data;
  },

  resetPassword: async (email: string, otpCode: string, newPassword: string) => {
    const response = await apiClient.post(`${API_URL}/reset-password`, { email, otpCode, newPassword });
    return response.data;
  }
};
