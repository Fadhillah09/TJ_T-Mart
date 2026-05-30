import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Pastikan semua icon diimport dari lucide-react
import { 
  User, 
  MapPin, 
  Clock, 
  CreditCard, 
  LogOut, 
  Package, 
  ChevronRight,
  ShieldCheck 
} from 'lucide-react';

const KurirHome = () => {
    const navigate = useNavigate();
    const [isCheckedIn, setIsCheckedIn] = useState(false);

    // Data Identitas Kurir (Nanti dikoneksikan ke Laravel)
    const courierData = {
        nama: "Muhammad Fadhillah",
        jabatan: "Kurir Utama",
        no_rekening: "1234567890",
        bank: "BCA",
        mart_unit: "TJ-T Mart Unit 1"
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-24 overflow-x-hidden">
            {/* HEADER & PROFIL (Style Merah TJ-T Mart) */}
            <div className="bg-[#d50d27] p-6 rounded-b-[2.5rem] shadow-xl shadow-[#d50d27]/20 relative">
                <div className="flex justify-between items-start text-white relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-[#d50d27] shadow-lg">
                            <User size={30} />
                        </div>
                        <div>
                            <p className="text-white/80 text-xs font-medium">Selamat Bekerja,</p>
                            <h1 className="text-xl font-bold leading-tight">{courierData.nama}</h1>
                            <div className="flex items-center gap-1 mt-1 text-[10px] font-black uppercase tracking-widest bg-black/20 w-fit px-2 py-0.5 rounded-full border border-white/20">
                                <ShieldCheck size={10} /> {courierData.jabatan}
                            </div>
                        </div>
                    </div>
                    <button className="p-2 bg-white/10 rounded-xl">
                        <LogOut size={20} />
                    </button>
                </div>
            </div>

            <div className="px-5 -mt-8 relative z-20">
                {/* KARTU PRESENSI */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-2xl ${isCheckedIn ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Status Absensi</p>
                                <p className="text-sm font-bold text-gray-800">{isCheckedIn ? 'Sedang Bertugas' : 'Belum Mulai Kerja'}</p>
                            </div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => setIsCheckedIn(!isCheckedIn)}
                        className={`w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-95 ${
                            isCheckedIn 
                            ? 'bg-gray-100 text-gray-400' 
                            : 'bg-[#d50d27] text-white shadow-lg shadow-[#d50d27]/20'
                        }`}
                    >
                        {isCheckedIn ? 'CHECK-OUT (SELESAI)' : 'CHECK-IN SEKARANG'}
                    </button>
                </div>

                {/* INFO REKENING UNTUK SUPER ADMIN */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <CreditCard size={14} className="text-[#d50d27]" /> Identitas Payroll
                    </h3>
                    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-dashed border-gray-200">
                        <div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase">{courierData.bank}</p>
                            <p className="text-lg font-black text-gray-800 tracking-tight">{courierData.no_rekening}</p>
                        </div>
                        <div className="text-right text-[10px] text-gray-500 font-bold">A/N {courierData.nama.split(' ')[0]}</div>
                    </div>
                </div>

                {/* DAFTAR PESANAN */}
                <div className="space-y-4">
                    <h2 className="font-bold text-gray-800 text-lg">Tugas Pengantaran</h2>
                    <div 
                        onClick={() => navigate('/kurir/delivery-map')}
                        className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between active:bg-gray-50 cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-gray-100 p-3 rounded-2xl text-gray-600">
                                <Package size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm">#ORD-9921</h4>
                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                    <MapPin size={10} /> Gedung A, Kamar 302
                                </p>
                            </div>
                        </div>
                        <ChevronRight className="text-gray-300" size={20} />
                    </div>
                </div>
            </div>

            {/* BOTTOM NAV */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-10 py-4 flex justify-between items-center z-[1000]">
                <button className="flex flex-col items-center text-[#d50d27]">
                    <Package size={24} />
                    <span className="text-[9px] mt-1 font-black uppercase">Orders</span>
                </button>
                <button className="flex flex-col items-center text-gray-400" onClick={() => navigate('/kurir/delivery-map')}>
                    <MapPin size={24} />
                    <span className="text-[9px] mt-1 font-black uppercase">Tracking</span>
                </button>
                <button className="flex flex-col items-center text-gray-400">
                    <User size={24} />
                    <span className="text-[9px] mt-1 font-black uppercase">Profil</span>
                </button>
            </div>
        </div>
    );
};

export default KurirHome;