import { 
  getMessaging, 
  requestPermission, 
  getToken, 
  AuthorizationStatus 
} from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';
import { notificationApi } from './services/notifService';

async function requestUserPermissionAndRegisterToken(userJwtToken: string): Promise<void> {
  const messagingInstance = getMessaging(getApp());

  const authStatus = await requestPermission(messagingInstance);
  const enabled: boolean =
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL;

  if (enabled) {

    const fcmToken: string = await getToken(messagingInstance);
    if (fcmToken) {
      try {
        await notificationApi.registerToken(fcmToken, userJwtToken);
      } catch (error) {
        console.error("don't save the token on the server", error);
      }
    }
  }
}

export default requestUserPermissionAndRegisterToken;