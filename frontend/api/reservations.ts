import { apiClient } from './client';

export interface Reservation {
  _id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string;
  numberOfPeople: number;
  type: 'table' | 'restaurant';
  tableNumber?: string;
  orderId?: any;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
}

export const reservationsApi = {
  getReservations: async () => {
    return apiClient.get('/reservations');
  },
  createReservation: async (data: any) => {
    return apiClient.post('/reservations', data);
  },
  updateStatus: async (id: string, status: string) => {
    return apiClient.patch(`/reservations/${id}/status`, { status });
  },
  deleteReservation: async (id: string) => {
    return apiClient.delete(`/reservations/${id}`);
  },
};
