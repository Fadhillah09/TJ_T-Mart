import api from './axiosConfig';
import { User, ApiResponse } from '@/types';

export const authApi = {
  login: async (credentials: object) => {
    const response = await api.post<ApiResponse<{ user: User; access_token: string; token_type: string }>>('/auth/login', credentials);
    return response.data;
  },
  register: async (formData: FormData) => {
    const response = await api.post<ApiResponse<{ user: User }>>('/auth/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  logout: async () => {
    const response = await api.post<ApiResponse<null>>('/auth/logout');
    return response.data;
  },
  logoutAll: async () => {
    const response = await api.post<ApiResponse<null>>('/auth/logout-all');
    return response.data;
  },
  me: async () => {
    const response = await api.get<ApiResponse<{ user: User }>>('/auth/me');
    return response.data;
  },
  resendVerification: async () => {
    const response = await api.post<ApiResponse<null>>('/auth/email/resend');
    return response.data;
  },
};
