import { apiClient } from './client';

export const inventoryApi = {
  getItems: () => apiClient.get('/inventory'),
  createItem: (data: { name: string; stock: number; unit: string }) => 
    apiClient.post('/inventory', data),
};
