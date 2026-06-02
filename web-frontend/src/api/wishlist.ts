import api from './axiosConfig'
import type { ApiResponse } from '../types'
 
export const getWishlist = () =>
  api.get<ApiResponse<any[]>>('/wishlist')
 
export const addWishlist = (produk_id: number) =>
  api.post<ApiResponse<any>>('/wishlist', { produk_id })
 
export const removeWishlist = (id: number) =>
  api.delete<ApiResponse<null>>(`/wishlist/${id}`)