import api from './axiosConfig'
import type { ApiResponse, User } from '../types'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  password_confirmation: string
  phone?: string
  nomor_kamar?: string
  penghuni_asrama?: boolean
}

export interface AuthData {
  access_token: string
  token_type: string
  user: User
}

export const login = (data: LoginPayload) =>
  api.post<ApiResponse<AuthData>>('/auth/login', data)

export const register = (data: RegisterPayload) =>
  api.post<ApiResponse<{ user: User }>>('/auth/register', data)

export const logout = () =>
  api.post<ApiResponse<null>>('/auth/logout')

export const logoutAll = () =>
  api.post<ApiResponse<null>>('/auth/logout-all')

export const me = () =>
  api.get<ApiResponse<{ user: User }>>('/auth/me')

export const resendVerification = () =>
  api.post<ApiResponse<null>>('/auth/email/resend')