import api from './axiosConfig';
import { GalonTransaction, PaginatedResponse, ApiResponse } from '@/types';

export interface OrderGalonPayload {
  nama_galon: string;
  jumlah: number;
  harga_satuan: number;
  metode_pembayaran: 'COD' | 'midtrans';
  metode_pengiriman: 'ambil' | 'antar';
  ongkir?: number;
  catatan?: string;
}

export const galonApi = {
  getGalonHistory: async () => {
    const response = await api.get<PaginatedResponse<GalonTransaction>>('/galon');
    return response.data;
  },

  getGalonDetail: async (id: number) => {
    const response = await api.get<ApiResponse<GalonTransaction>>(`/galon/${id}`);
    return response.data;
  },

  orderGalon: async (data: OrderGalonPayload) => {
    const response = await api.post<ApiResponse<GalonTransaction>>('/galon', data);
    return response.data;
  },

  getSnapToken: async (payload: { total_amount: number; product_name: string }) => {
    const response = await api.post<ApiResponse<{ snap_token: string }>>('/payment/snap-galon', payload);
    return response.data;
  },

  storeMidtrans: async (payload: {
    nama_galon: string;
    jumlah: number;
    harga_satuan: number;
    total_harga: number;
    order_id: string;
    status: string;
    metode_pengiriman?: string;
    catatan?: string;
  }) => {
    const response = await api.post<ApiResponse<GalonTransaction>>('/galon/midtrans', payload);
    return response.data;
  },
};