import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
    // Pengganti x-data Alpine.js
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        // Karena ini Front-end terpisah, kita cegah refresh halaman
        e.preventDefault();
        setLoading(true);
        
        // Logika kirim data ke API Laravel akan diletakkan di sini nanti
        console.log("Form submitted");
    };

    return (
        <div className="fixed inset-0 z-50 flex bg-white font-sans overflow-hidden">
            {/* SISI KIRI: BRANDING */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-black h-full overflow-hidden">
                <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                     className="absolute inset-0 w-full h-full object-cover opacity-40 blur-md scale-110" 
                     alt="Background Login" />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                <div className="relative z-10 w-full flex flex-col justify-between p-12 xl:p-16 text-white h-full">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-20 bg-[#d50d27] rounded-xl flex items-center justify-center shadow-lg shadow-[#d50d27]/40">
                                <span className="text-xl font-bold">TJ&T</span>
                            </div>
                            <span className="text-lg font-bold tracking-wide">Mart</span>
                        </div>
                        
                        <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-4">
                            Selamat Datang<br />Kembali!
                        </h1>
                        <p className="text-gray-300 text-base xl:text-lg max-w-md">
                            Masuk untuk melanjutkan belanja kebutuhan asrama Anda dengan mudah dan hemat.
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

            {/* SISI KANAN: FORM LOGIN */}
            <div className="w-full lg:w-1/2 h-full bg-white overflow-y-auto overflow-x-hidden relative flex items-center">
                <div className="w-full py-10 px-6 sm:px-12 lg:px-16 xl:px-20">
                    
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Masuk Akun</h2>
                        <p className="text-sm text-gray-500 mt-2">Gunakan akun terdaftar Anda untuk mulai berbelanja.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                            <input type="email" name="email" required autoFocus 
                                   className="w-full border-gray-200 bg-gray-50 rounded-xl focus:ring-[#d50d27] focus:border-[#d50d27] focus:bg-white transition-all py-3 px-4 text-sm shadow-sm"
                                   placeholder="Masukkan email Anda" />
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-bold text-gray-700">Password</label>
                                <Link className="text-xs font-bold text-[#d50d27] hover:underline" to="/forgot-password">
                                    Lupa Password?
                                </Link>
                            </div>
                            <div className="relative">
                                <input type={showPassword ? 'text' : 'password'} name="password" required 
                                       className="w-full border-gray-200 bg-gray-50 rounded-xl focus:ring-[#d50d27] focus:border-[#d50d27] focus:bg-white transition-all py-3 px-4 pr-12 text-sm shadow-sm"
                                       placeholder="••••••••" />
                                
                                <button type="button" onClick={() => setShowPassword(!showPassword)} 
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#d50d27]">
                                    {!showPassword ? (
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 012.168-3.507M9.88 9.88a3 3 0 104.24 4.24M6.1 6.1l11.8 11.8" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center">
                            <label htmlFor="remember_me" className="inline-flex items-center group cursor-pointer select-none">
                                <input id="remember_me" type="checkbox" className="rounded border-gray-300 text-[#d50d27] shadow-sm focus:ring-[#d50d27] cursor-pointer w-4 h-4" name="remember" />
                                <span className="ml-2 text-sm text-gray-500 group-hover:text-gray-900 transition">Ingat Saya</span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button type="submit" disabled={loading}
                                    className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-xl shadow-[#d50d27]/20 text-sm font-bold text-white bg-[#d50d27] hover:bg-black transition-all duration-300 transform active:scale-[0.98]">
                                {loading && (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                    </svg>
                                )}
                                <span>{loading ? 'Memverifikasi...' : 'Masuk Sekarang'}</span>
                            </button>
                        </div>

                        {/* Link Daftar */}
                        <div className="text-center mt-6">
                            <p className="text-sm text-gray-500">
                                Belum punya akun?{' '}
                                <Link to="/register" className="font-bold text-[#d50d27] hover:underline">
                                    Daftar Disini
                                </Link>
                            </p>
                        </div>
                    </form>
                    
                    <div className="mt-12 text-center">
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
                            &copy; {new Date().getFullYear()} TJ-T Mart. Excellence in Service.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;