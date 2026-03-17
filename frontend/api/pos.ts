import { apiClient } from './client';

export const posApi = {
  getProducts: () => apiClient.get('/pos/products'),
  createProduct: (data: { name: string; price: number; ingredients: any[] }) => 
    apiClient.post('/pos/products', data),
  createOrder: (items: { productId: string; quantity: number; notes?: string }[]) => 
    apiClient.post('/pos/orders', { items }),
};
