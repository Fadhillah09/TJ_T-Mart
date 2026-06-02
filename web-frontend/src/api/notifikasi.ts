import api from './axiosConfig';
import { Notification, PaginatedResponse, ApiResponse } from '@/types';

export const notifikasiApi = {
  getNotifikasi: async () => {
    const response = await api.get<PaginatedResponse<Notification>>('/notifikasi');
    return response.data;
  },
  markAsRead: async (id: number) => {
    const response = await api.put<ApiResponse<Notification>>(`/notifikasi/${id}/read`);
    return response.data;
  },
  markAllRead: async () => {
    const response = await api.put<ApiResponse<null>>('/notifikasi/read-all');
    return response.data;
  },
};
