import apiClient from '../client';

const API_URL = '/notification';


export const notificationApi = {

  notifications: async () => {
    const response = await apiClient.get(`${API_URL}/notification`);
    return response.data;
  },

  registerToken: async (fcmToken: string, userJwtToken: string) => {
    const response = await apiClient.post(`${API_URL}/user-device/register-token/${fcmToken}`,
        {
            headers: { Authorization: `Bearer ${userJwtToken}` },
        }
    );
    return response.data;
  },

  deleteToken: async (fcmToken: string) => {
    const response = await apiClient.delete(`${API_URL}/user-device/delete-token/${fcmToken}`);
    return response.data;
  }

};