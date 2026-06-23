import { create } from 'zustand';
import { secureStorage } from '../utils/secureStorage';
import { authApi } from '../api/services/authService';
import requestUserPermissionAndRegisterToken from '../api/registerToken';

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
  setUser: (user: User) => Promise<void>;
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

  setUser: async (user) => {
    set({ user, isAuthenticated: !!user });
  },

  login: async (accessToken, refreshToken, user) => {
    await secureStorage.saveTokens(accessToken, refreshToken);
    set({
      accessToken,
      refreshToken,
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: async () => {
    await secureStorage.clearTokens();
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
      const accessToken = await secureStorage.getAccessToken();
      const refreshToken = await secureStorage.getRefreshToken();

      if (accessToken && refreshToken) {
        set({ accessToken, refreshToken });

        try {
          const email = await authApi.me();

          if (email) {
            set({
              user: { email },
              isAuthenticated: true,
            });

            try {
              await requestUserPermissionAndRegisterToken(accessToken);
              console.log('FCM Token checked and registered successfully');
            } catch (fcmError) {
              console.error("don't save the token on the server", fcmError);
            }

            set({ isLoading: false });
          } else {
            set({ isLoading: false, isAuthenticated: false });
          }
        } catch (apiError) {
          set({ isLoading: false, isAuthenticated: false });
        }
      } else {
        set({ isLoading: false, isAuthenticated: false });
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