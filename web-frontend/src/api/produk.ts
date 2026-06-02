import api from './axiosConfig'
import type { ApiResponse, PaginatedResponse, Produk, KategoriProduk, Banner } from '../types'
 
export interface ProdukParams {
  kategori_id?: number
  search?: string
  mart_id?: number
  page?: number
}
 
export const getProduk = (params?: ProdukParams) =>
  api.get<PaginatedResponse<Produk>>('/produk', { params })
 
export const getProdukDetail = (id: number) =>
  api.get<ApiResponse<Produk>>(`/produk/${id}`)
 
export const getKategori = () =>
  api.get<ApiResponse<KategoriProduk[]>>('/kategori')
 
export const getBanners = () =>
  api.get<ApiResponse<Banner[]>>('/banner')