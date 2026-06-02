import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  try {
    const storageStr = localStorage.getItem('auth-storage');
    if (storageStr) {
      const storage = JSON.parse(storageStr);
      const token = storage?.state?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.error('Error reading auth-storage from localStorage', error);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || 'Terjadi kesalahan';

      if (status === 401) {
        localStorage.removeItem('auth-storage');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      } else if (status === 403) {
        toast.error('Akses ditolak');
      } else if (status === 422) {
        // Let forms handle validation errors
        return Promise.reject(error);
      } else if (status === 429) {
        toast.error('Terlalu banyak permintaan. Coba lagi dalam beberapa menit.');
      } else if (status >= 500) {
        toast.error('Terjadi kesalahan server. Silakan coba lagi.');
      } else {
        toast.error(message);
      }
    } else if (error.request) {
      toast.error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
    } else {
      toast.error('Terjadi kesalahan yang tidak terduga.');
    }
    
    return Promise.reject(error);
  }
);

export default api;