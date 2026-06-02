import api from './axiosConfig'
import type { ApiResponse, Cart } from '../types'
 
export interface CartResponse {
  cart: Cart
  total_harga: number
  total_items: number
}
 
export const getCart = () =>
  api.get<ApiResponse<CartResponse>>('/cart')
 
export const addToCart = (produk_id: number, quantity: number) =>
  api.post<ApiResponse<CartResponse>>('/cart', { produk_id, quantity })
 
export const updateCartItem = (id: number, quantity: number) =>
  api.put<ApiResponse<CartResponse>>(`/cart/${id}`, { quantity })
 
export const removeCartItem = (id: number) =>
  api.delete<ApiResponse<CartResponse>>(`/cart/${id}`)
 