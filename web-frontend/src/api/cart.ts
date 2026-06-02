import api from './axiosConfig';
import { Cart, ApiResponse } from '@/types';

export const cartApi = {
  getCart: async () => {
    const response = await api.get<ApiResponse<Cart>>('/cart');
    return response.data;
  },
  addToCart: async (produk_id: number, quantity: number) => {
    const response = await api.post<ApiResponse<Cart>>('/cart', { produk_id, quantity });
    return response.data;
  },
  updateCartItem: async (id: number, quantity: number) => {
    const response = await api.put<ApiResponse<Cart>>(`/cart/${id}`, { quantity });
    return response.data;
  },
  removeCartItem: async (id: number) => {
    const response = await api.delete<ApiResponse<Cart>>(`/cart/${id}`);
    return response.data;
  },
};
