import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const transactionService = {
  async getTransactions(params = {}) {
    // Backend doesn't have a general GET /transactions endpoint
    // This would need to be implemented in backend or use account-specific endpoint
    throw new Error('General transactions endpoint not available');
  },

  async getTransactionById(id) {
    // Backend doesn't have a GET /transactions/{id} endpoint
    throw new Error('Transaction by ID endpoint not available');
  },

  async getTransactionsByAccount(accountId, params = {}) {
    const response = await api.get(`/transactions/account/${accountId}`, { params });
    return response.data;
  }
}; 