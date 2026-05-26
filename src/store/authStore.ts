import { create } from 'zustand';
import { secureStorage } from '../utils/secureStorage';

interface User {
  email: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User | null) => void;
  login: (accessToken: string, refreshToken: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  updateAccessToken: (accessToken: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,

  setTokens: (accessToken, refreshToken) => {
    set({ accessToken, refreshToken });
  },

  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },

  login: async (accessToken, refreshToken, user) => {
    // Save tokens to secure storage
    await secureStorage.saveTokens(accessToken, refreshToken);

    // Update state
    set({
      accessToken,
      refreshToken,
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: async () => {
    // Clear tokens from secure storage
    await secureStorage.clearTokens();

    // Reset state
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  initialize: async () => {
    set({ isLoading: true });

    try {
      // Load tokens from secure storage
      const accessToken = await secureStorage.getAccessToken();
      const refreshToken = await secureStorage.getRefreshToken();

      if (accessToken && refreshToken) {
        set({
          accessToken,
          refreshToken,
          isLoading: false,
        });

        // Optionally fetch user data here
        // You might want to validate the token or fetch user profile
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ isLoading: false });
    }
  },

  updateAccessToken: (accessToken) => {
    secureStorage.saveAccessToken(accessToken);
    set({ accessToken });
  },
}));
