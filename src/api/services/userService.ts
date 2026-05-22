import apiClient from '../client';

const API_URL = '/auth';

export interface Feedback {
  description: string;
}

export const userApi = {

  add: async (object: Feedback, type: string) => {
    const response = await apiClient.post(`${API_URL}/feedback/${type}`, { ...object});
    return response.data;
  }

};
