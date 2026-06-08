import { useState } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ── Local Types (tidak bergantung @/types agar tidak error) ────────────── */
export interface Produk {
  id: number;
  nama_produk: string;
  harga: number;
  stok: number;
  gambar_url?: string;
  kategori?: string;
  lokasi?: string[];
  rating?: number;
}

export interface KategoriProduk {
  id: number;
  nama_kategori: string;
  slug?: string;
}

/* ── Props ──────────────────────────────────────────────────────────────── */
interface ProductCategorySectionProps {
  kat: KategoriProduk & { produk: Produk[] };
  wishlistedIds: Set<number>;
  onAddToCart: (produk: Produk) => void;
  onToggleWishlist: (produk: Produk) => void;
  onViewAll: (id: number) => void;
}

interface ProductGridProps {
  produk: Produk[];
  wishlistedIds: Set<number>;
  onAddToCart: (produk: Produk) => void;
  onToggleWishlist: (produk: Produk) => void;
}

interface ProductLoadingSkeletonProps {
  count?: number;
}

/* ── Helper ─────────────────────────────────────────────────────────────── */
const formatRupiah = (num: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num);

/* ── Single Product Card ────────────────────────────────────────────────── */
function ProductItem({
  produk,
  wishlistedIds,
  onAddToCart,
  onToggleWishlist,
}: {
  produk: Produk;
  wishlistedIds: Set<number>;
  onAddToCart: (p: Produk) => void;
  onToggleWishlist: (p: Produk) => void;
}) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const isWishlisted = wishlistedIds.has(produk.id);
  const stokHabis = produk.stok === 0;

  return (
    <div
      className="group relative bg-white rounded-2xl border border-black/5 hover:border-[#E68757] hover:shadow-lg transition overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={() => navigate(`/produk/${produk.id}`)}
        className="block p-3 w-full text-left"
      >
        {/* Image */}
        <div className="relative rounded-xl overflow-hidden">
          <img
            src={produk.gambar_url || ''}
            alt={produk.nama_produk}
            className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
            onError={e => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1599599810694-e1b42fc85b72?w=400&q=80';
            }}
          />
          {stokHabis && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl">
              <span className="text-white font-black text-sm">HABIS</span>
            </div>
          )}
        </div>

        {/* Nama */}
        <h3 className="mt-3 text-sm font-medium text-black line-clamp-2">
          {produk.nama_produk}
        </h3>

        {/* Harga */}
        <div className="mt-1 text-base font-semibold text-[#930014]">
          {formatRupiah(produk.harga)}
        </div>

        {/* Stok */}
        <div className={`mt-1 text-xs font-semibold flex items-center gap-1 ${
          produk.stok > 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          <span className="uppercase tracking-wide">Stok:</span>
          <span className="text-sm">{produk.stok}</span>
        </div>

        {/* Lokasi */}
        {produk.lokasi && produk.lokasi.length > 0 && (
          <div className="mt-1 text-xs text-black/60 leading-snug">
            <span>Lokasi: </span>
            <span>{produk.lokasi.join(', ')}</span>
          </div>
        )}
      </button>

      {/* Action Buttons — muncul saat hover */}
      {hovered && !stokHabis && (
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
          {/* Wishlist */}
          <button
            onClick={e => { e.stopPropagation(); onToggleWishlist(produk); }}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition ${
              isWishlisted
                ? 'bg-[#dc2626] border-[#dc2626] text-white'
                : 'bg-[#E7BD8A]/80 hover:bg-[#E68757] border-[#930014]/30 text-[#930014] hover:text-white'
            }`}
          >
            <Heart size={16} className={isWishlisted ? 'fill-white' : ''} />
          </button>

          {/* Cart */}
          <button
            onClick={e => { e.stopPropagation(); onAddToCart(produk); }}
            className="w-9 h-9 rounded-full bg-[#DB4B3A] hover:bg-[#930014] border border-[#930014] flex items-center justify-center text-white transition"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

/* ── ProductCategorySection ─────────────────────────────────────────────── */
export function ProductCategorySection({
  kat,
  wishlistedIds,
  onAddToCart,
  onToggleWishlist,
  onViewAll,
}: ProductCategorySectionProps) {
  const MAX_DISPLAY = 6;
  const produkTampil = kat.produk.slice(0, MAX_DISPLAY);
  const hasMore = kat.produk.length > MAX_DISPLAY;

  if (produkTampil.length === 0) return null;

  return (
    <section className="mt-10">
      {/* Header Kategori */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-[#5B000B] tracking-tight">
          {kat.nama_kategori}
        </h2>
        {hasMore && (
          <button
            onClick={() => onViewAll(kat.id)}
            className="text-sm font-medium text-[#930014] hover:text-[#DB4B3A] transition inline-flex items-center gap-1"
          >
            Lihat semua →
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {produkTampil.map(produk => (
          <ProductItem
            key={produk.id}
            produk={produk}
            wishlistedIds={wishlistedIds}
            onAddToCart={onAddToCart}
            onToggleWishlist={onToggleWishlist}
          />
        ))}
      </div>
    </section>
  );
}

/* ── ProductGrid (flat, tanpa kategori) ─────────────────────────────────── */
export function ProductGrid({
  produk,
  wishlistedIds,
  onAddToCart,
  onToggleWishlist,
}: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
      {produk.map(p => (
        <ProductItem
          key={p.id}
          produk={p}
          wishlistedIds={wishlistedIds}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
        />
      ))}
    </div>
  );
}

/* ── ProductLoadingSkeleton ─────────────────────────────────────────────── */
export function ProductLoadingSkeleton({ count = 6 }: ProductLoadingSkeletonProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-black/5 overflow-hidden p-3 animate-pulse">
          <div className="w-full h-40 rounded-xl bg-gray-200" />
          <div className="mt-3 h-4 bg-gray-200 rounded w-3/4" />
          <div className="mt-2 h-4 bg-gray-200 rounded w-1/2" />
          <div className="mt-1 h-3 bg-gray-200 rounded w-1/3" />
        </div>
      ))}
    </div>
  );
}