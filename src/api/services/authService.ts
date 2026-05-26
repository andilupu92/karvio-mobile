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
};
