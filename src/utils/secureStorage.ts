import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const secureStorage = {
  // Save access token
  saveAccessToken: async (token: string) => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error saving access token:', error);
    }
  },

  // Get access token
  getAccessToken: async (): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  },

  // Save refresh token
  saveRefreshToken: async (token: string) => {
    try {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
    } catch (error) {
      console.error('Error saving refresh token:', error);
    }
  },

  // Get refresh token
  getRefreshToken: async (): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  },

  // Save both tokens
  saveTokens: async (accessToken: string, refreshToken: string) => {
    try {
      await Promise.all([
        SecureStore.setItemAsync(TOKEN_KEY, accessToken),
        SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
      ]);
    } catch (error) {
      console.error('Error saving tokens:', error);
    }
  },

  // Clear all tokens
  clearTokens: async () => {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(TOKEN_KEY),
        SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
      ]);
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  },
};
