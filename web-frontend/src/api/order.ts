import api from './axiosConfig'
import type { ApiResponse, PaginatedResponse, RiwayatPembelian } from '../types'
 
export interface CreateOrderPayload {
  tipe_layanan: 'pickup' | 'delivery'
  metode_pembayaran: 'COD' | 'MIDTRANS'
  alamat_pengantaran?: string
  items: { produk_id: number; quantity: number }[]
}
 
export const getOrders = (params?: { status?: string; page?: number }) =>
  api.get<PaginatedResponse<RiwayatPembelian>>('/riwayat-pembelian', { params })
 
export const getOrderDetail = (id: number) =>
  api.get<ApiResponse<RiwayatPembelian>>(`/riwayat-pembelian/${id}`)
 
export const createOrder = (data: CreateOrderPayload) =>
  api.post<ApiResponse<RiwayatPembelian>>('/riwayat-pembelian', data)
 
// ─────────────────────────────────────────────
// src/api/galon.ts
// ─────────────────────────────────────────────
export {}
 