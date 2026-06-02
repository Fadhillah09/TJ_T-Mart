import api from './axiosConfig'
import type { ApiResponse, PaginatedResponse, Notification } from '../types'
 
export const getNotifikasi = () =>
  api.get<PaginatedResponse<Notification>>('/notifikasi')
 
export const markAsRead = (id: number) =>
  api.put<ApiResponse<null>>(`/notifikasi/${id}/read`)
 
export const markAllRead = () =>
  api.put<ApiResponse<null>>('/notifikasi/read-all')