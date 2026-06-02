import api from './axiosConfig'
import type { ApiResponse, PaginatedResponse, GalonTransaction } from '../types'
 
export interface OrderGalonPayload {
  nama_galon: 'Galon Baru + Isi' | 'Galon 19L (Isi Ulang)'
  jumlah: number
  metode_pembayaran: 'COD' | 'MIDTRANS'
  metode_pengiriman: 'ambil' | 'antar'
  catatan?: string
}
 
export const getGalonHistory = () =>
  api.get<PaginatedResponse<GalonTransaction>>('/galon')
 
export const orderGalon = (data: OrderGalonPayload) =>
  api.post<ApiResponse<GalonTransaction>>('/galon', data)