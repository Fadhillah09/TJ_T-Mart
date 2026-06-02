import api from './axiosConfig';
import { TokenTransaction, PaginatedResponse, ApiResponse } from '@/types';

export const tokenApi = {
  getTokenHistory: async () => {
    const response = await api.get<PaginatedResponse<TokenTransaction>>('/token');
    return response.data;
  },
  buyToken: async (data: object) => {
    const response = await api.post<ApiResponse<TokenTransaction>>('/token', data);
    return response.data;
  },
};
