import { useNavigate } from 'react-router-dom';
import { GalonTransaction } from '@/types';
import StatusChip from './StatusChip';

interface HistoryCardProps {
  transaksi: GalonTransaction;
}

const HistoryCard = ({ transaksi }: HistoryCardProps) => {
  const navigate = useNavigate();

  const tanggal = transaksi.created_at
    ? new Date(transaksi.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
    : '-';
  const pukul = transaksi.created_at
    ? new Date(transaksi.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    : '-';

  return (
    <div className="relative overflow-hidden bg-white p-6 rounded-3xl border-2 border-gray-200
                    shadow-lg shadow-gray-100 transition-all duration-500
                    hover:shadow-[0_10px_25px_rgba(219,75,58,0.15)] hover:border-[#dc2626]
                    hover:-translate-y-1">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">

        {/* Kiri */}
        <div className="flex gap-4 items-start">

          {/* Ikon */}
          <div className="h-14 w-14 flex-shrink-0 rounded-xl flex items-center justify-center
                          bg-red-50 text-[#930014] border border-[#dc2626]/20 shadow-md">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 21v-4a2 2 0 012-2h0a2 2 0 012 2v4M12 22s8-4 8-10V5L12 2 4 5v7
                   c0 6 8 10 8 10zM12 17c1.38 0 2.5-1.12 2.5-2.5s-1.12-2.5-2.5-2.5
                   -2.5 1.12-2.5 2.5 1.12 2.5 2.5 2.5z" />
            </svg>
          </div>

          <div>
            <h4 className="text-xl font-black text-gray-900 tracking-tight">
              {transaksi.nama_galon} ({transaksi.jumlah} Galon)
            </h4>
            <p className="text-sm font-black text-[#930014] mt-1">
              Total: Rp{transaksi.total_harga.toLocaleString('id-ID')}
            </p>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-2">
              Tanggal: {tanggal} • Pukul: {pukul}
            </p>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-gray-400">
                Status:
              </span>
              <StatusChip status={transaksi.status} />
            </div>
          </div>
        </div>

        {/* Kanan */}
        <div className="w-full md:w-auto mt-4 md:mt-0">
          <button
            onClick={() => navigate(`/galon/detail/${transaksi.id}`)}
            className="group flex items-center justify-center gap-2 w-full md:w-auto
                       px-8 py-3 bg-white text-gray-900 font-black rounded-xl
                       border-2 border-[#dc2626]/50 shadow-lg shadow-[#dc2626]/10
                       active:scale-95 hover:bg-[#dc2626] hover:text-white
                       transition-all duration-300">
            DETAIL PESANAN
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Dekorasi */}
      <div className="absolute -right-10 -bottom-10 h-32 w-32 bg-orange-100/30
                      rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default HistoryCard;