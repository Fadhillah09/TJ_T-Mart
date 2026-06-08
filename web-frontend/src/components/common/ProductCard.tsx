import React, { useState } from 'react';
import { Heart, ShoppingCart, MapPin, Star } from 'lucide-react';
import { Product } from '@/types';

interface ProductCardProps {
  produk: Product;
  wishlistedIds: Set<number>;
  onAddToCart: (produk: Product) => void;
  onToggleWishlist: (produk: Product) => void;
  isAdding: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  produk,
  wishlistedIds,
  onAddToCart,
  onToggleWishlist,
  isAdding,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isWishlistHovered, setIsWishlistHovered] = useState(false);
  const isWishlisted = wishlistedIds.has(produk.id);
  const stokHabis = produk.stok === 0;

  const formatRupiah = (num: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div
      className={`w-full h-full bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group ${
        stokHabis ? 'opacity-70' : ''
      }`}
    >
      {/* IMAGE CONTAINER */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {/* Image */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
        )}
        
        <img
          src={produk.gambar_url || ''}
          alt={produk.nama_produk}
          className={`w-full h-full object-contain p-3 sm:p-4 transition-all duration-500 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={e => {
            (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1599599810694-e1b42fc85b72?w=400&h=400&fit=crop&q=80`;
            setImageLoaded(true);
          }}
        />

        {/* Stock Badge */}
        {stokHabis && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
            <span className="text-white font-black text-lg drop-shadow-lg">HABIS</span>
          </div>
        )}

        {/* Stock Status - Corner */}
        {!stokHabis && produk.stok <= 5 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-full animate-pulse">
            HAMPIR HABIS
          </div>
        )}

        {/* Wishlist Button - Interactive */}
        <button
          onClick={() => onToggleWishlist(produk)}
          onMouseEnter={() => setIsWishlistHovered(true)}
          onMouseLeave={() => setIsWishlistHovered(false)}
          className={`absolute top-2 sm:top-3 right-2 sm:right-3 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${
            isWishlisted || isWishlistHovered
              ? 'bg-gradient-to-br from-[#d50d27] to-[#ba0015] shadow-lg shadow-[#d50d27]/50'
              : 'hover:shadow-xl hover:shadow-gray-300'
          }`}
        >
          <Heart
            size={18}
            className={`transition-all duration-300 ${
              isWishlisted
                ? 'text-white fill-white scale-110'
                : isWishlistHovered
                ? 'text-white fill-white scale-105 animate-pulse-subtle'
                : 'text-gray-400'
            }`}
          />

          {/* Pulsing Ring Effect when Wishlist Hovered */}
          {isWishlistHovered && (
            <div className="absolute inset-0 rounded-full border-2 border-[#d50d27] animate-ping opacity-75"></div>
          )}
        </button>

        {/* Rating Badge */}
        {produk.rating && (
          <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span>{produk.rating}</span>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        {/* Product Name */}
        <h3 className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-2 mb-2 min-h-[2rem] leading-snug group-hover:text-[#d50d27] transition-colors">
          {produk.nama_produk}
        </h3>

        {/* Price - Prominent */}
        <div className="mb-2 sm:mb-3">
          <p className="text-base sm:text-lg font-black text-[#d50d27] leading-none mb-1">
            {formatRupiah(produk.harga)}
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
            Harga terbaik untuk Anda
          </p>
        </div>

        {/* Stock Status */}
        <div className="mb-2 sm:mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`flex-1 h-1.5 rounded-full overflow-hidden bg-gray-200 ${
                produk.stok > 10 ? 'bg-green-100' : 'bg-orange-100'
              }`}
            >
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  produk.stok > 10
                    ? 'bg-gradient-to-r from-green-500 to-green-600'
                    : 'bg-gradient-to-r from-orange-500 to-orange-600'
                }`}
                style={{ width: `${Math.min((produk.stok / 30) * 100, 100)}%` }}
              ></div>
            </div>
            <span className={`text-xs font-black whitespace-nowrap ${
              produk.stok > 10 ? 'text-green-600' : 'text-orange-600'
            }`}>
              {produk.stok}
            </span>
          </div>
        </div>

        {/* Locations */}
        {produk.lokasi.length > 0 && (
          <div className="mb-3 sm:mb-4">
            <p className="text-[10px] text-gray-600 font-semibold mb-1 flex items-center gap-1">
              <MapPin size={12} className="text-[#d50d27]" />
              Lokasi:
            </p>
            <p className="text-[10px] text-gray-600 leading-relaxed line-clamp-2">
              {produk.lokasi.join(', ')}
            </p>
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(produk)}
          disabled={isAdding || stokHabis}
          className="w-full mt-auto py-2.5 sm:py-3 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-[#d50d27] to-[#ba0015] text-white hover:from-[#ba0015] hover:to-[#9c0012] hover:shadow-lg hover:shadow-[#d50d27]/30 active:scale-95 transition-all duration-300 disabled:from-gray-300 disabled:to-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden group/btn"
        >
          {/* Animated background shine effect */}
          <div className="absolute inset-0 -left-full group-hover/btn:left-full transition-all duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/btn:opacity-100" />

          <ShoppingCart size={16} className="relative z-10" />
          <span className="relative z-10">{stokHabis ? 'Habis' : 'Beli'}</span>
        </button>

        {/* Loading State */}
        {isAdding && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-2xl flex items-center justify-center z-20">
            <div className="animate-spin">
              <div className="w-6 h-6 border-3 border-gray-300 border-t-[#d50d27] rounded-full"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;