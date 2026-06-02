import api from './axiosConfig';
import { RiwayatPembelian, PaginatedResponse, ApiResponse } from '@/types';

export const orderApi = {
  getOrders: async (params?: object) => {
    const response = await api.get<PaginatedResponse<RiwayatPembelian>>('/riwayat-pembelian', { params });
    return response.data;
  },
  getOrderDetail: async (id: number) => {
    const response = await api.get<ApiResponse<RiwayatPembelian>>(`/riwayat-pembelian/${id}`);
    return response.data;
  },
  createOrder: async (data: object) => {
    const response = await api.post<ApiResponse<RiwayatPembelian>>('/riwayat-pembelian', data);
    return response.data;
  },
};
