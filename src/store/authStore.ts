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

  setUser: async(user) => {
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

          try {
            const email = await authApi.me();
            if (email) {
              set({ 
                user: { email: email },
                isAuthenticated: true,
                isLoading: false 
              });

              try {
                await requestUserPermissionAndRegisterToken(accessToken);
                console.log('FCM Token verificat/actualizat cu succes la pornire.');
              } catch (fcmError) {
                console.error('Eroare la înregistrarea Firebase pe init:', fcmError);
              }
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
      set({ isLoading: false, isAuthenticated: false });
    }
  },

  updateAccessToken: (accessToken) => {
    secureStorage.saveAccessToken(accessToken);
    set({ accessToken });
  },
}));
