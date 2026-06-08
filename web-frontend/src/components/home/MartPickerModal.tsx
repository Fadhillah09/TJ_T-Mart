import { Mart } from '@/types';

interface MartPickerModalProps {
  marts: Mart[];
  activeMartId: number | null;
  onSelect: (mart: Mart | null) => void;
  onClose: () => void;
  totalProduk?: number;
}

export default function MartPickerModal({
  marts,
  activeMartId,
  onSelect,
  onClose,
  totalProduk = 0,
}: MartPickerModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900 text-base">Pilih prioritas toko</h3>
            <p className="text-xs text-gray-500 mt-0.5">Pilih toko untuk menentukan prioritas produk yang ditampilkan:</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* Options */}
        <div className="p-4 space-y-2">
          {/* Semua Mart */}
          <button
            onClick={() => { onSelect(null); onClose(); }}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 transition-all ${
              activeMartId === null
                ? 'border-[#ba0015] bg-red-50/50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <span className={`font-bold text-sm ${activeMartId === null ? 'text-[#ba0015]' : 'text-gray-800'}`}>
              Semua Mart
            </span>
            <span className="text-xs text-gray-500 font-medium">{totalProduk} produk (total)</span>
          </button>

          {marts.map(mart => (
            <button
              key={mart.id}
              onClick={() => { onSelect(mart); onClose(); }}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 transition-all ${
                activeMartId === mart.id
                  ? 'border-[#ba0015] bg-red-50/50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className={`font-bold text-sm ${activeMartId === mart.id ? 'text-[#ba0015]' : 'text-gray-800'}`}>
                {mart.nama_mart}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
