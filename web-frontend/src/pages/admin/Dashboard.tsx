import React, { useState } from 'react';
import { Users, DollarSign, CreditCard, Search, ShieldCheck } from 'lucide-react';

const DashboardAdmin = () => {
    // Simulasi Role (Nanti data ini diambil dari Token JWT saat login)
    const [userRole] = useState('super_admin'); 
    
    const [kurirList] = useState([
        { 
            id: 1, 
            nama: "Muhammad Fadhillah", 
            jabatan: "Kurir Utama", 
            bank: "BCA", 
            rekening: "1234567890", 
            gaji_pokok: 3500000 
        }
    ]);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar khusus Super Admin */}
            <div className="w-64 bg-gray-900 text-white hidden lg:block p-6">
                <div className="flex items-center gap-3 mb-10">
                    <div className="h-8 w-16 bg-[#d50d27] rounded-lg flex items-center justify-center font-bold text-xs shadow-lg shadow-[#d50d27]/40">TJ&T</div>
                    <span className="font-bold">Super Admin</span>
                </div>
                
                <nav className="space-y-2">
                    <div className="p-3 bg-[#d50d27] rounded-xl font-bold flex items-center gap-3 cursor-pointer">
                        <DollarSign size={20} /> Kelola Gaji
                    </div>
                    <div className="p-3 hover:bg-white/10 rounded-xl flex items-center gap-3 cursor-pointer text-gray-400">
                        <Users size={20} /> Data Karyawan
                    </div>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Payroll Management</h1>
                        <p className="text-sm text-gray-500 italic">Otoritas Khusus Super Admin</p>
                    </div>
                    
                    {userRole === 'super_admin' && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-xs font-black border border-green-200">
                            <ShieldCheck size={14} /> MODE SUPER ADMIN AKTIF
                        </div>
                    )}
                </header>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Kurir</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Jabatan</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Detail Rekening</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Gaji Terakhir</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Aksi Keuangan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {kurirList.map((kurir) => (
                                <tr key={kurir.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 font-bold text-gray-800">{kurir.nama}</td>
                                    <td className="p-4 text-xs text-gray-500 font-semibold uppercase">{kurir.jabatan}</td>
                                    <td className="p-4 text-sm font-medium text-blue-600">
                                        <div className="flex items-center gap-2">
                                            <CreditCard size={14} /> {kurir.bank} - {kurir.rekening}
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm font-black">Rp {kurir.gaji_pokok.toLocaleString('id-ID')}</td>
                                    <td className="p-4 text-center">
                                        {/* HANYA SUPER ADMIN YANG BISA LIHAT TOMBOL INI */}
                                        {userRole === 'super_admin' ? (
                                            <button className="bg-[#d50d27] hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#d50d27]/20 active:scale-95">
                                                INPUT GAJI BULAN INI
                                            </button>
                                        ) : (
                                            <span className="text-gray-300 italic text-xs">No Access</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardAdmin;