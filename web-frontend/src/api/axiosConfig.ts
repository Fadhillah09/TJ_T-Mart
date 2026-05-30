import axios from 'axios';

// 1. Membuat instance axios agar lebih rapi
const api = axios.create({
    // Ganti dengan alamat URL Laravel kamu (hasil dari php artisan serve)
    baseURL: 'http://127.0.0.1:8000/api', 
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// 2. Interceptor: Otomatis menyelipkan Token Login ke setiap request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        // Ini standar keamanan agar API tahu siapa yang sedang akses (Admin/Kurir)
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;