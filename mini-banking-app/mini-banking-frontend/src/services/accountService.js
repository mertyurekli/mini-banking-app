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

export const accountService = {
  async getAccounts(params = {}) {
    // Backend doesn't have a general GET /accounts endpoint
    // We'll use search with empty term to get all accounts
    const response = await api.post('/accounts/search', null, { 
      params: { searchTerm: params.searchTerm || '' } 
    });
    return response.data;
  },

  async getAccountById(id) {
    const response = await api.get(`/accounts/${id}`);
    return response.data;
  },

  async getAccountByNumber(accountNumber) {
    const response = await api.get(`/accounts/number/${accountNumber}`);
    return response.data;
  },

  async createAccount(accountData) {
    const response = await api.post('/accounts', accountData);
    return response.data;
  },

  async updateAccount(id, accountData) {
    const response = await api.put(`/accounts/${id}`, accountData);
    return response.data;
  },

  async deleteAccount(id) {
    console.log('=== ACCOUNT SERVICE DELETE START ===');
    console.log('Account ID:', id);
    console.log('Account ID type:', typeof id);
    
    // Ensure ID is a string for the URL
    const accountId = String(id);
    console.log('Account ID as string:', accountId);
    console.log('API URL:', `/accounts/${accountId}`);
    console.log('Full URL:', `${API_BASE_URL}/accounts/${accountId}`);
    
    try {
      console.log('Making DELETE request...');
      const response = await api.delete(`/accounts/${accountId}`);
      console.log('Delete response status:', response.status);
      console.log('Delete response data:', response.data);
      console.log('=== ACCOUNT SERVICE DELETE SUCCESS ===');
      return response.data;
    } catch (error) {
      console.error('=== ACCOUNT SERVICE DELETE ERROR ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      console.error('Error headers:', error.response?.headers);
      console.error('Request config:', error.config);
      throw error;
    }
  },

  async transferMoney(transferData) {
    const response = await api.post('/transactions/transfer', transferData);
    return response.data;
  },

  async getTransactionHistory(accountId) {
    const response = await api.get(`/transactions/account/${accountId}`);
    return response.data;
  }
}; 