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
  loadingStep: 0 | 1 | 2 | 3;

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
  loadingStep: 0,

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
      loadingStep: 3,
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
      loadingStep: 0,
    });
  },

  initialize: async () => {
    set({ isLoading: true, loadingStep: 0 });

    try {
      const accessToken = await secureStorage.getAccessToken();
      const refreshToken = await secureStorage.getRefreshToken();
      set({ loadingStep: 1 });

      if (accessToken && refreshToken) {
        set({ accessToken, refreshToken });

        try {
          const email = await authApi.me();
          set({ loadingStep: 2 });

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

            set({ loadingStep: 3, isLoading: false });
          } else {
            set({ loadingStep: 3, isLoading: false, isAuthenticated: false });
          }
        } catch (apiError) {
          set({ loadingStep: 3, isLoading: false, isAuthenticated: false });
        }
      } else {
        set({ loadingStep: 3, isLoading: false, isAuthenticated: false });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ loadingStep: 3, isLoading: false });
    }
  },

  updateAccessToken: (accessToken) => {
    secureStorage.saveAccessToken(accessToken);
    set({ accessToken });
  },
}));