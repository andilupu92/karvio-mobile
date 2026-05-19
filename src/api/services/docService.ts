import apiClient from '../client';

const API_URL = '/document';

export interface DocumentCredentials {
  carId: number;
  documentTypeId: number;
  expiryDate: Date;
  amount?: number | undefined;
  insertDate?: Date | undefined;
}

export interface ExpenseCredentials {
  carId: number;
  expenseTypeId: number;
  amount: number | undefined;
  date: Date | undefined;
}

export const documentApi = {
  documentTypes: async (category: string) => {
    const response = await apiClient.get(`${API_URL}/documentTypes/${category}`);
    return response.data;
  },

  expenseTypes: async () => {
    const response = await apiClient.get(`${API_URL}/expenseTypes`);
    return response.data;
  },

  documents: async (carId: number) => {
    const response = await apiClient.get(`${API_URL}/documents/${carId}`);
    return response.data;
  },

  expenses: async (carId: number) => {
    const response = await apiClient.get(`${API_URL}/expenses/${carId}/3`);
    return response.data;
  },

  addDocument: async (credentials: DocumentCredentials) => {
    const response = await apiClient.post(`${API_URL}/documents`, { ...credentials });
    return response.data;
  },

  updateDocument: async (documentId: number, credentials: DocumentCredentials) => {
    const response = await apiClient.put(`${API_URL}/documents/${documentId}`, { ...credentials });
    return response.data;
  },

  addExpense: async (credentials: ExpenseCredentials) => {
    const response = await apiClient.post(`${API_URL}/expenses`, { ...credentials });
    return response.data;
  },

  deleteDocument: async (documentId: number) => {
    const response = await apiClient.delete(`${API_URL}/documents/${documentId}`);
    return response.data;
  },

  expensesHistory: async () => {
    const response = await apiClient.get(`${API_URL}/expenses`);
    return response.data;
  },

  documentsHistory: async () => {
    const response = await apiClient.get(`${API_URL}/documents`);
    return response.data;
  },

  deleteExpense: async (expenseId: number) => {
    const response = await apiClient.delete(`${API_URL}/expenses/byExpense/${expenseId}`);
    return response.data;
  },

  deleteAllExpensesByCar: async (carId: number) => {
    const response = await apiClient.delete(`${API_URL}/expenses/byCar/${carId}`);
    return response.data;
  },
};
