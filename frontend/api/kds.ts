import { apiClient } from './client';

export const kdsApi = {
  getActiveOrders: () => apiClient.get('/kds/orders'),
  updateStatus: (id: string, status: string) => 
    apiClient.patch(`/kds/orders/${id}/status`, { status }),
};
