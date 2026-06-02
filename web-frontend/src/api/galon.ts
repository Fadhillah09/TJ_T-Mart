import api from './axiosConfig';
import { GalonTransaction, PaginatedResponse, ApiResponse } from '@/types';

export const galonApi = {
  getGalonHistory: async () => {
    const response = await api.get<PaginatedResponse<GalonTransaction>>('/galon');
    return response.data;
  },
  orderGalon: async (data: object) => {
    const response = await api.post<ApiResponse<GalonTransaction>>('/galon', data);
    return response.data;
  },
};
