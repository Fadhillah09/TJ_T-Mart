import React, { useState } from "react";
import { Store, Trash2, ShoppingCart, ImageOff, Loader2 } from "lucide-react";
import { Produk } from "@/types";
import { currency, resolveGambar } from "@/utils/produkUtils";

interface WishlistCardProps {
  produk: Produk;
  onRemove: (id: number) => void;
  onAddToCart: (id: number) => void;
  isRemoving: boolean;
  isAdding: boolean;
}

export const WishlistCard: React.FC<WishlistCardProps> = ({
  produk,
  onRemove,
  onAddToCart,
  isRemoving,
  isAdding,
}) => {
  const [imageError, setImageError] = useState(false);
  
  const hasDiskon = !!(produk.persentase_diskon && produk.persentase_diskon > 0);
  const hargaDiskon = hasDiskon
    ? produk.harga - produk.harga * (produk.persentase_diskon! / 100)
    : produk.harga;

  // Safe resolve mart name from eager-loaded relationship
  const martName =
    (produk as any).produk_marts?.[0]?.mart?.nama_mart ||
    (produk as any).produkMarts?.[0]?.mart?.nama_mart ||
    "Mart Tidak Diketahui";

  const gambarUrl = resolveGambar(produk);

  return (
    <div className="group bg-white rounded-3xl border border-gray-100 hover:border-red-500/20 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full relative">
      
      {/* Badge Diskon */}
      {hasDiskon && (
        <span className="absolute top-3 left-3 bg-[#dc2626] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full z-10 animate-pulse-subtle">
          {produk.persentase_diskon}% OFF
        </span>
      )}

      {/* Floating Action Button: Delete from Wishlist */}
      <button
        type="button"
        onClick={() => onRemove(produk.id)}
        disabled={isRemoving}
        className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-red-50 text-gray-500 hover:text-[#dc2626] backdrop-blur-sm rounded-full border border-gray-100 hover:border-red-100 transition-all z-20 shadow-sm disabled:opacity-50 btn-active-scale cursor-pointer"
        title="Hapus dari Wishlist"
      >
        <Trash2 size={13} />
      </button>

      {/* Product Image Area */}
      <div className="relative aspect-square w-full bg-gray-50 overflow-hidden flex items-center justify-center">
        {imageError || !gambarUrl ? (
          <div className="flex flex-col items-center justify-center text-gray-400 gap-1.5">
            <ImageOff size={22} className="text-gray-300" />
            <span className="text-[9px] font-bold tracking-tight text-gray-400">Tidak ada gambar</span>
          </div>
        ) : (
          <img
            src={gambarUrl}
            alt={produk.nama_produk}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>

      {/* Product Info Area */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1">
          {/* Mart Label */}
          <div className="flex items-center gap-1 text-[9px] font-extrabold text-gray-400 uppercase tracking-widest">
            <Store size={10} className="text-[#dc2626] shrink-0" />
            <span className="truncate">{martName}</span>
          </div>

          {/* Product Name */}
          <h3 className="font-extrabold text-xs text-gray-900 group-hover:text-red-600 transition-colors uppercase tracking-tight line-clamp-2 leading-snug">
            {produk.nama_produk}
          </h3>
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="space-y-2.5">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-xs font-black text-[#dc2626]">
              {currency(hargaDiskon)}
            </span>
            {hasDiskon && (
              <span className="text-[10px] text-gray-400 line-through font-bold">
                {currency(produk.harga)}
              </span>
            )}
          </div>

          {/* Add To Cart Button */}
          <button
            type="button"
            onClick={() => onAddToCart(produk.id)}
            disabled={isAdding}
            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-md shadow-red-950/10 disabled:bg-red-400 disabled:cursor-not-allowed cursor-pointer"
          >
            {isAdding ? (
              <Loader2 size={11} className="animate-spin" />
            ) : (
              <ShoppingCart size={11} />
            )}
            <span>{isAdding ? "Menambahkan..." : "+ Keranjang"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
