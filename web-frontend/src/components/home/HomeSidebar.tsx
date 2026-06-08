import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export default function HomeSidebar() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <aside className="lg:col-span-4 xl:col-span-3">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-[108px]">
        {/* Greeting */}
        <div className="mb-6 pb-6 border-b border-gray-100">
          <p className="text-gray-500 text-sm font-medium mb-0.5">Selamat datang,</p>
          <h2 className="text-2xl font-extrabold text-[#ba0015] mb-4">
            {user?.name?.split(' ')[0] ?? 'Pengguna'}
          </h2>

          {user?.penghuni_asrama ? (
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-xs font-bold text-gray-700">
                <span className="material-symbols-outlined text-[#ba0015] text-sm">apartment</span>
                {user.lokasi?.nama_gedung || user.lokasi?.nama_lokasi || 'Asrama'}
              </div>
              {user.nomor_kamar && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-xs font-bold text-gray-700">
                  <span className="material-symbols-outlined text-[#ba0015] text-sm">meeting_room</span>
                  Kamar {user.nomor_kamar}
                </div>
              )}
            </div>
          ) : !user ? (
            <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
              <p className="text-xs text-[#ba0015]">
                <span className="font-bold">Masuk</span> untuk menikmati layanan lengkap.
              </p>
            </div>
          ) : null}

          <p className="text-sm text-gray-500 leading-relaxed">
            Permudah penuhi setiap kebutuhan asramamu dengan sistem yang{' '}
            <span className="text-[#ba0015] font-bold">terintegrasi</span>, cepat, dan aman.
          </p>
        </div>

        {/* Layanan Utama */}
        <div className="space-y-3">
          <p className="text-[10px] font-black text-[#ba0015] uppercase tracking-widest">Layanan Utama</p>

          <button
            onClick={() => navigate('/token')}
            className="w-full flex items-center justify-between p-3.5 bg-white border border-gray-200 rounded-xl hover:border-[#ba0015] hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#ba0015] flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-white text-[20px]">bolt</span>
              </div>
              <div className="text-left">
                <p className="font-bold text-sm text-gray-800">Token Listrik</p>
                <p className="text-[10px] font-semibold text-[#ba0015] uppercase tracking-wide">BELI SEKARANG</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-gray-400 text-lg group-hover:translate-x-1 transition-transform">
              chevron_right
            </span>
          </button>

          <button
            onClick={() => navigate('/galon')}
            className="w-full flex items-center justify-between p-3.5 bg-white border border-gray-200 rounded-xl hover:border-[#ba0015] hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#ba0015] flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-white text-[20px]">water_drop</span>
              </div>
              <div className="text-left">
                <p className="font-bold text-sm text-gray-800">Galon Asrama</p>
                <p className="text-[10px] font-semibold text-[#ba0015] uppercase tracking-wide">PESAN ANTAR</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-gray-400 text-lg group-hover:translate-x-1 transition-transform">
              chevron_right
            </span>
          </button>
        </div>

        {/* Footer trust badge */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-2 text-gray-400">
          <span className="material-symbols-outlined text-sm">verified_user</span>
          <p className="text-xs">Layanan terpercaya untuk asrama Anda.</p>
        </div>
      </div>
    </aside>
  );
}
