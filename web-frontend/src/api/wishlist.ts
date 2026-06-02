import api from './axiosConfig';
import { Produk, ApiResponse } from '@/types';

export const wishlistApi = {
  getWishlist: async () => {
    const response = await api.get<ApiResponse<{ produk: Produk[] }>>('/wishlist');
    return response.data;
  },
  addWishlist: async (produk_id: number) => {
    const response = await api.post<ApiResponse<null>>('/wishlist', { produk_id });
    return response.data;
  },
  removeWishlist: async (id: number) => {
    const response = await api.delete<ApiResponse<null>>(`/wishlist/${id}`);
    return response.data;
  },
};
