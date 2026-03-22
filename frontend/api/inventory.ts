import { apiClient } from './client';

export const inventoryApi = {
  getItems: () => apiClient.get('/inventory'),
  createItem: (data: { name: string; stock: number; unit: string; category?: string }) => 
    apiClient.post('/inventory', data),
  updateItem: (id: string, data: { stock?: number; outOfStock?: boolean }) =>
    apiClient.patch(`/inventory/${id}`, data),
};
