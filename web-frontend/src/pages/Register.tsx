import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Gedung {
    id: number;
    nama_lokasi: string; // atau nama_gedung sesuai skema tabel lokasi Anda
}

interface Kamar {
    id: number;
    nomor_kamar: string;
    lantai: number;
}

const Register = () => {
    const [isAsrama, setIsAsrama] = useState('1');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // State untuk menampung pilihan user
    const [selectedGedung, setSelectedGedung] = useState('');
    const [selectedKamar, setSelectedKamar] = useState('');

    // 1. Ambil data gedung asrama dari backend
    const { data: listGedung } = useQuery<Gedung[]>({
        queryKey: ['api-gedung'],
        queryFn: async () => {
            const res = await axios.get('http://localhost:8000/api/lokasi');
            // Menyesuaikan struktur wrapper response (ApiResponse) dari Laravel Anda
            return res.data.success ? res.data.data : res.data;
        }
    });

    // 2. Ambil data master kamar yang sudah di-seed
    const { data: listKamar } = useQuery<Kamar[]>({
        queryKey: ['api-master-kamar'],
        queryFn: async () => {
            const res = await axios.get('http://localhost:8000/api/kamar'); // sesuaikan dengan route api backend Anda
            return res.data.success ? res.data.data : res.data;
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
    
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
    
        try {
            await axios.post('http://localhost:8000/api/auth/register', {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('no_telp'),
                password: formData.get('password'),
                password_confirmation: formData.get('password_confirmation'),
                penghuni_asrama: isAsrama === '1',
                lokasi_id: selectedGedung || null,
                nomor_kamar: selectedKamar || null,
            });
            
            window.location.href = '/login';
    
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || 'Registrasi gagal');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex bg-white font-sans overflow-hidden">

            {/* BAGIAN KIRI: BRANDING (Identik dengan Login) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-black h-full overflow-hidden">
                <img src="https://images.unsplash.com/photo-1580913428706-c311ab527eb3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                    className="absolute inset-0 w-full h-full object-cover opacity-40 blur-md scale-110"
                    alt="Background Register" />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                <div className="relative z-10 w-full flex flex-col justify-between p-12 xl:p-16 text-white h-full">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-20 bg-[#d50d27] rounded-xl flex items-center justify-center shadow-lg shadow-[#d50d27]/40">
                                <span className="text-xl font-bold">TJ&T</span>
                            </div>
                            <span className="text-lg font-semibold tracking-wide">Mart</span>
                        </div>

                        <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-4">
                            Bergabunglah dengan<br />Komunitas Kami.
                        </h1>
                        <p className="text-gray-300 text-base xl:text-lg max-w-md">
                            Dapatkan akses eksklusif ke promo asrama, pengiriman cepat, dan kemudahan belanja harian.
                        </p>

                        <div className="mt-6 inline-block">
                            <div className="flex items-center gap-2 px-4 py-2 bg-[#d50d27]/20 backdrop-blur-md border border-[#d50d27]/50 rounded-lg text-[#d50d27] font-bold text-sm">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Buka: 08:00 - 21:00 WIB</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
                        <div>
                            <p className="text-2xl font-bold text-[#FFFFFF]">08:00 - 21:00</p>
                            <p className="text-sm text-gray-400 mt-1">Jam Operasional</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#FFFFFF]">100%</p>
                            <p className="text-sm text-gray-400 mt-1">Produk Terjamin</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* BAGIAN KANAN: FORM REGISTER */}
            <div className="w-full lg:w-1/2 h-full bg-gray-50 overflow-y-auto">
                <div className="min-h-full flex flex-col justify-center py-10 px-6 sm:px-12 lg:px-16 xl:px-20">

                    <div className="mb-6 text-center lg:text-left">
                        <h2 className="text-2xl xl:text-3xl font-bold text-gray-900">Buat Akun Baru 🚀</h2>
                        <p className="text-sm text-gray-500 mt-1">Lengkapi data diri Anda untuk memulai.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Nama Lengkap - Ditambahkan border-2 agar tegas */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap</label>
                            <input type="text" name="name" required autoFocus
                                className="w-full border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#d50d27]/20 focus:border-[#d50d27] py-2.5 px-4 text-sm bg-white outline-none transition-all"
                                placeholder="Nama sesuai KTM" />
                        </div>

                        {/* Email & No Telp - Grid Kolom */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                                <input type="email" name="email" required
                                    className="w-full border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#d50d27]/20 focus:border-[#d50d27] py-2.5 px-4 text-sm bg-white outline-none transition-all"
                                    placeholder="email@gmail..." />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">No. WhatsApp</label>
                                <input type="text" name="no_telp" required
                                    className="w-full border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#d50d27]/20 focus:border-[#d50d27] py-2.5 px-4 text-sm bg-white outline-none transition-all"
                                    placeholder="0812..." />
                            </div>
                        </div>

                        {/* Status Penghuni - Box Penampung agar rapi */}
                        <div className="bg-white p-5 rounded-xl border-2 border-gray-100 shadow-sm">
                            <label className="block text-sm font-bold text-gray-700 mb-3">Status Tempat Tinggal</label>

                            <div className="flex gap-6 mb-2">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="radio" name="status_penghuni" value="1"
                                        checked={isAsrama === '1'}
                                        onChange={(e) => setIsAsrama(e.target.value)}
                                        className="w-4 h-4 text-[#d50d27] focus:ring-[#d50d27] accent-[#d50d27]" />
                                    <span className="text-sm font-bold text-gray-600 group-hover:text-[#d50d27] transition-colors">Penghuni Asrama</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="radio" name="status_penghuni" value="0"
                                        checked={isAsrama === '0'}
                                        onChange={(e) => setIsAsrama(e.target.value)}
                                        className="w-4 h-4 text-[#d50d27] focus:ring-[#d50d27] accent-[#d50d27]" />
                                    <span className="text-sm font-bold text-gray-600 group-hover:text-[#d50d27] transition-colors">Luar Asrama</span>
                                </label>
                            </div>
                            {isAsrama === '1' && (
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-50 pt-4">
                                    {/* PILIH GEDUNG */}
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 mb-1 uppercase tracking-wider">Gedung Asrama</label>
                                        <select
                                            name="lokasi_id"
                                            value={selectedGedung}
                                            onChange={(e) => setSelectedGedung(e.target.value)}
                                            required
                                            className="w-full border-2 border-gray-100 rounded-lg focus:border-[#d50d27] py-2 px-3 bg-gray-50 text-sm font-semibold outline-none"
                                        >
                                            <option value="">-- Pilih Gedung --</option>
                                            {listGedung?.map((gedung) => (
                                                <option key={gedung.id} value={gedung.id}>
                                                    {gedung.nama_lokasi}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* PILIH NOMOR KAMAR */}
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 mb-1 uppercase tracking-wider">Nomor Kamar</label>
                                        <select
                                            name="nomor_kamar"
                                            value={selectedKamar}
                                            onChange={(e) => setSelectedKamar(e.target.value)}
                                            required
                                            className="w-full border-2 border-gray-100 rounded-lg focus:border-[#d50d27] py-2 px-3 bg-gray-50 text-sm font-semibold outline-none"
                                        >
                                            <option value="">-- Pilih Nomor --</option>
                                            {listKamar?.map((kamar) => (
                                                <option key={kamar.id} value={kamar.nomor_kamar}>
                                                    {kamar.nomor_kamar} (Lantai {kamar.lantai})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}
                            </div>

                            {/* Password - Perbaikan Border Kolom */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                                    <div className="relative">
                                        <input type={showPassword ? 'text' : 'password'} name="password" required
                                            className="w-full border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#d50d27]/20 focus:border-[#d50d27] py-2.5 px-4 pr-10 text-sm bg-white outline-none" />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#d50d27]">
                                            {!showPassword ? (
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                            ) : (
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 012.168-3.507M9.88 9.88a3 3 0 104.24 4.24M6.1 6.1l11.8 11.8" /></svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Konfirmasi Pass</label>
                                    <input type={showPassword ? 'text' : 'password'} name="password_confirmation" required
                                        className="w-full border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#d50d27]/20 focus:border-[#d50d27] py-2.5 px-4 text-sm bg-white outline-none" />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button type="submit" disabled={loading}
                                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-[#d50d27]/30 text-sm font-bold text-white bg-[#d50d27] hover:bg-black transition-all duration-200 transform hover:-translate-y-0.5">
                                    {loading && (
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                                    )}
                                    <span>{loading ? 'Mendaftarkan Akun...' : 'Daftar Sekarang'}</span>
                                </button>
                            </div>

                            <div className="text-center mt-4">
                                <p className="text-sm text-gray-600">
                                    Sudah punya akun?{' '}
                                    <Link to="/login" className="font-bold text-[#d50d27] hover:underline transition">Masuk Disini</Link>
                                </p>
                            </div>
                    </form>

                    <div className="mt-8 text-center pb-4">
                        <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} TJ-T Mart. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;