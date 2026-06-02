import api from './axiosConfig';
import { Produk, KategoriProduk, Banner, PaginatedResponse, ApiResponse } from '@/types';

export const produkApi = {
  getProduk: async (params?: object) => {
    const response = await api.get<PaginatedResponse<Produk>>('/produk', { params });
    return response.data;
  },
  getProdukDetail: async (id: number) => {
    const response = await api.get<ApiResponse<Produk>>(`/produk/${id}`);
    return response.data;
  },
  getKategori: async () => {
    const response = await api.get<ApiResponse<KategoriProduk[]>>('/kategori');
    return response.data;
  },
  getBanners: async () => {
    const response = await api.get<ApiResponse<Banner[]>>('/banner');
    return response.data;
  },
};
