import api from './axiosConfig';
import { Mart, LokasiDelivery, ApiResponse } from '@/types';

export const martApi = {
  getMarts: async () => {
    const response = await api.get<ApiResponse<Mart[]>>('/mart');
    return response.data;
  },
  getMartDetail: async (id: number) => {
    const response = await api.get<ApiResponse<Mart>>(`/mart/${id}`);
    return response.data;
  },
  getLokasi: async (mart_id?: number) => {
    const response = await api.get<ApiResponse<LokasiDelivery[]>>('/lokasi', { params: { mart_id } });
    return response.data;
  },
  getKamar: async () => {
    // Assuming /kamar returns a list of strings or objects representing rooms
    const response = await api.get<ApiResponse<any[]>>('/kamar');
    return response.data;
  },
};
