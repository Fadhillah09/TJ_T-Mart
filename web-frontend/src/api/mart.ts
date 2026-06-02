import api from './axiosConfig'
import type { ApiResponse, Mart, LokasiDelivery } from '../types'
 
export const getMarts = () =>
  api.get<ApiResponse<Mart[]>>('/mart')
 
export const getMartDetail = (id: number) =>
  api.get<ApiResponse<Mart>>(`/mart/${id}`)
 
export const getLokasi = (mart_id?: number) =>
  api.get<ApiResponse<LokasiDelivery[]>>('/lokasi', { params: mart_id ? { mart_id } : {} })