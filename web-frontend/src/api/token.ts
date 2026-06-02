import api from './axiosConfig'
import type { ApiResponse, PaginatedResponse, TokenTransaction } from '../types'
 
export interface BuyTokenPayload {
  nominal: 20000 | 50000 | 100000 | 200000 | 500000
  metode_pembayaran: 'COD' | 'MIDTRANS'
}
 
export const getTokenHistory = () =>
  api.get<PaginatedResponse<TokenTransaction>>('/token')
 
export const buyToken = (data: BuyTokenPayload) =>
  api.post<ApiResponse<TokenTransaction>>('/token', data)