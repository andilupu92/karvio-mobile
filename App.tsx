import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { useEffect } from 'react';
import { useAuthStore } from './src/store/authStore';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/context/themeContext';
import{ 
  getMessaging,
  onTokenRefresh,
  onMessage
} from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';
import requestUserPermissionAndRegisterToken from './src/api/registerToken';
import { Alert } from 'react-native';
import { notificationApi } from './src/api/services/notifService';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const initialize = useAuthStore((state) => state.initialize);
  const isLoading = useAuthStore((state) => state.isLoading);

  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (fontsLoaded && !isLoading) {
      const hideSplash = async () => {
        await SplashScreen.hideAsync();
      };
      hideSplash();
    }
  }, [fontsLoaded, isLoading]);

  if (!fontsLoaded || isLoading) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function AppContent() {
  const { colorScheme } = useTheme();

  const user = useAuthStore((state) => state.user); 
  const jwtToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!user) return;

    const setupNotifications = async () => {
      if ( jwtToken ) {
        try {
          await requestUserPermissionAndRegisterToken(jwtToken);
        } catch (error) {
          console.error("Token error to get:", error);
        }
      };
    }
    
    setupNotifications();
    const messagingInstance = getMessaging(getApp());

    const unsubscribeTokenRefresh = onTokenRefresh(
      messagingInstance,
      async (newToken) => {
        try {
          if ( jwtToken ) {
            await notificationApi.registerToken(newToken, jwtToken);
          }
        } catch (error) {
          console.error("don't save the token on the server", error);
        }
      }
    );

    const unsubscribeOnMessage = onMessage(
      messagingInstance,
      async (remoteMessage) => {
        console.log("The notification was received while the app is open:", remoteMessage);
        
        Alert.alert(
          remoteMessage.notification?.title || "Notification",
          remoteMessage.notification?.body || ""
        );
      }
    );

    return () => {
      unsubscribeTokenRefresh();
      unsubscribeOnMessage();
    };

  }, [user]);

  return (
    <GluestackUIProvider mode={colorScheme === 'dark' ? 'dark' : 'light'}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </GluestackUIProvider>
  );
}
