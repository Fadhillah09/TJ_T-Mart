import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useWishlistStore } from '@/store/wishlistStore';
import { currency } from '@/utils/produkUtils';
import api from '@/api/axiosConfig';

interface Props {
  produk: any;
}

const ProdukTransaksi = ({ produk }: Props) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { wishlistedIds, toggleWishlist } = useWishlistStore();

  const [qty, setQty] = useState(1);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const hargaAsli: number = produk?.harga ?? 0;
  const hargaDiskon = produk?.persentase_diskon
    ? hargaAsli - hargaAsli * (produk.persentase_diskon / 100)
    : null;
  const hargaTampil = hargaDiskon ?? hargaAsli;
  const subtotal = hargaTampil * qty;

  const isWishlisted = wishlistedIds.includes(produk?.id);

  const handleWishlist = async () => {
    if (wishlistLoading || !produk?.id) return;
    toggleWishlist(produk.id);
    setWishlistLoading(true);
    try {
      if (isWishlisted) {
        await api.delete(`/wishlist/${produk.id}`);
      } else {
        await api.post('/wishlist', { produk_id: produk.id });
      }
    } catch {
      // Revert if failed
      toggleWishlist(produk.id);
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <div className="sticky top-36 bg-white border border-gray-100 rounded-2xl p-4 space-y-4 shadow-md">
      <div className="pb-3 border-b border-gray-100">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Produk Dipilih</p>
        <p className="font-black text-gray-900 text-xs leading-tight line-clamp-2">{produk.nama_produk}</p>
      </div>

      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Jumlah Pesanan
        </label>
        <div className="mt-1.5 flex items-center border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-[#dc2626] transition-all font-black text-base border-r border-gray-200 flex-shrink-0"
          >−</button>
          <input
            type="number" min={1} max={produk.stok} value={qty}
            onChange={(e) => setQty(Math.max(1, Math.min(produk.stok, Number(e.target.value))))}
            className="flex-1 py-1.5 text-sm font-black focus:outline-none text-center bg-transparent"
          />
          <button
            onClick={() => setQty((q) => Math.min(produk.stok, q + 1))}
            className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-[#dc2626] transition-all font-black text-base border-l border-gray-200 flex-shrink-0"
          >+</button>
        </div>
        <p className="text-[9px] text-gray-400 mt-1 font-medium">Maks: {produk.stok} unit tersedia</p>
      </div>

      <div className="bg-red-50 rounded-xl p-3">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Subtotal Tagihan</p>
        <span className="font-black text-xl text-[#dc2626] block tracking-tight mt-0.5">{currency(subtotal)}</span>
        {qty > 1 && (
          <p className="text-[9px] text-gray-400 font-medium mt-0.5">{qty} × {currency(hargaTampil)}</p>
        )}
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={handleWishlist}
          disabled={wishlistLoading}
          className={`w-10 h-10 border-2 rounded-xl flex items-center justify-center transition-all active:scale-90 flex-shrink-0 ${
            isWishlisted
              ? 'bg-red-50 border-[#dc2626] text-[#dc2626]'
              : 'bg-white border-[#dc2626] text-[#dc2626] hover:bg-red-50'
          }`}
        >
          <svg className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
        </button>
        <button
          onClick={() => addToCart({ produkId: produk.id, quantity: qty })}
          className="flex-1 font-black py-2.5 bg-white border-2 border-[#dc2626] rounded-xl flex items-center justify-center text-[#dc2626] hover:bg-red-50 transition-all gap-1.5 text-xs active:scale-95"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
          <span>+ Keranjang</span>
        </button>
      </div>

      <button
        onClick={() => navigate('/checkout', { state: { produk_id: produk.id, qty } })}
        className="w-full bg-[#dc2626] text-white py-2.5 font-black rounded-xl text-xs shadow-md hover:bg-[#b91c1c] transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider"
      >
        Beli Sekarang
      </button>
      <p className="text-[9px] text-gray-400 text-center italic font-medium">
        *Pastikan produk dan jumlah yang dibeli sudah sesuai
      </p>
    </div>
  );
};

export default ProdukTransaksi;