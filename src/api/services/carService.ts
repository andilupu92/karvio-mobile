import apiClient from '../client';

const API_URL = '/car';

export interface CarCredentials {
  name: string;
  energyType: string;
  kilometers: string;
  year: number;
}

export interface CarFuelCredentials {
  carId: number;
  kilometers: string;
  liters: number;
  date: Date;
  amount: number;
}

export const carApi = {
  cars: async () => {
    const response = await apiClient.get(`${API_URL}/cars`);
    return response.data;
  },

  add: async (credentials: CarCredentials) => {
    const response = await apiClient.post(`${API_URL}/cars`, credentials);
    return response.data;
  },

  carsWithExpenses: async () => {
    const response = await apiClient.get(`${API_URL}/cars/expenses`);
    return response.data;
  },

  deleteCar: async (carId: number) => {
    const response = await apiClient.delete(`${API_URL}/cars/${carId}`);
    return response.data;
  },

  addFuel: async (credentials: CarFuelCredentials) => {
    const response = await apiClient.post(`${API_URL}/cars/addFuel`, credentials);
    return response.data;
  },
};
