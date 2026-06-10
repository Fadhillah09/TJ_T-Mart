import { useState, useRef } from "react";
import { Heart, ShoppingCart, ChevronLeft, ChevronRight, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Produk, KategoriProduk } from "@/types";

interface ProductCategorySectionProps {
  kat: KategoriProduk & { produk: Produk[]; slug?: string };
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

const formatRupiah = (num: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);

/* ── Komponen Badge Mart ─────────────────────────────────────────────────── */
function MartAvailability({ produkMarts }: { produkMarts?: any[] }) {
  if (!produkMarts || produkMarts.length === 0) return null;

  return (
    <div className="mt-2 pt-2 border-t border-gray-100">
      <div className="flex items-center gap-1 mb-1.5">
        <Store size={10} className="text-gray-400 shrink-0" />
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
          Tersedia di
        </span>
      </div>
      <div className="flex flex-wrap gap-1">
        {produkMarts.map((pm: any) => (
          <span
            key={pm.mart_id}
            className="inline-flex items-center gap-1 text-[9px] bg-gradient-to-r from-red-50 to-red-50/50 text-[#930014] px-2 py-0.5 rounded-full font-bold border border-red-200/60"
          >
            {/* Dot indikator hijau = tersedia */}
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
            {pm.mart?.nama_mart ?? `Mart ${pm.mart_id}`}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Komponen Kartu Produk ───────────────────────────────────────────────── */
export function ProductItem({
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
      className="group relative bg-white rounded-2xl border border-black/5 hover:border-[#E68757] hover:shadow-lg transition overflow-hidden shrink-0 w-[180px] flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Area klik ke detail produk ── */}
      <button
        onClick={() => navigate(`/produk/${produk.id}`)}
        className="block p-3 w-full text-left flex-1"
      >
        {/* Gambar */}
        <div className="relative rounded-xl overflow-hidden">
          <img
            src={produk.gambar_url || ""}
            alt={produk.nama_produk}
            className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1599599810694-e1b42fc85b72?w=400&q=80";
            }}
          />
          {stokHabis && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl">
              <span className="text-white font-black text-sm">HABIS</span>
            </div>
          )}
          {/* Badge hampir habis */}
          {!stokHabis && produk.stok <= 5 && (
            <div className="absolute top-2 left-2 bg-orange-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full animate-pulse">
              HAMPIR HABIS
            </div>
          )}
        </div>

        {/* Nama Produk */}
        <h3 className="mt-3 text-sm font-medium text-black line-clamp-2 leading-snug group-hover:text-[#d50d27] transition-colors">
          {produk.nama_produk}
        </h3>

        {/* Harga */}
        <div className="mt-1.5 text-base font-semibold text-[#930014]">
          {formatRupiah(produk.harga)}
        </div>

        {/* Stok */}
        <div className="mt-1 flex items-center gap-1.5">
          <div
            className={`flex-1 h-1.5 rounded-full overflow-hidden ${
              stokHabis ? "bg-red-100" : produk.stok > 10 ? "bg-green-100" : "bg-orange-100"
            }`}
          >
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                stokHabis
                  ? "bg-red-400 w-full"
                  : produk.stok > 10
                  ? "bg-gradient-to-r from-green-500 to-green-600"
                  : "bg-gradient-to-r from-orange-500 to-orange-600"
              }`}
              style={
                stokHabis ? undefined : { width: `${Math.min((produk.stok / 30) * 100, 100)}%` }
              }
            />
          </div>
          <span
            className={`text-xs font-black whitespace-nowrap ${
              stokHabis ? "text-red-500" : produk.stok > 10 ? "text-green-600" : "text-orange-600"
            }`}
          >
            {stokHabis ? "Habis" : `${produk.stok}`}
          </span>
        </div>

        {/* ── Ketersediaan Mart ── */}
        <MartAvailability produkMarts={produk.produk_marts} />
      </button>

      {/* ── Action Buttons (muncul saat hover) ── */}
      {hovered && !stokHabis && (
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(produk);
            }}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition ${
              isWishlisted
                ? "bg-[#dc2626] border-[#dc2626] text-white"
                : "bg-[#E7BD8A]/80 hover:bg-[#E68757] border-[#930014]/30 text-[#930014] hover:text-white"
            }`}
          >
            <Heart size={16} className={isWishlisted ? "fill-white" : ""} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(produk);
            }}
            className="w-9 h-9 rounded-full bg-[#DB4B3A] hover:bg-[#930014] border border-[#930014] flex items-center justify-center text-white transition"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

/* ── ProductCategorySection ──────────────────────────────────────────────── */
export function ProductCategorySection({
  kat,
  wishlistedIds,
  onAddToCart,
  onToggleWishlist,
  onViewAll,
}: ProductCategorySectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  if (kat.produk.length === 0) return null;

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-[#5B000B] tracking-tight">
          {kat.nama_kategori}
        </h2>
        <button
          onClick={() => onViewAll(kat.id)}
          className="text-sm font-medium text-[#930014] hover:text-[#DB4B3A] transition inline-flex items-center gap-1"
        >
          Lihat semua →
        </button>
      </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#d50d27 #fef2f2" }}
        >
          {kat.produk.map((produk) => (
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

/* ── ProductGrid ─────────────────────────────────────────────────────────── */
export function ProductGrid({
  produk,
  wishlistedIds,
  onAddToCart,
  onToggleWishlist,
}: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
      {produk.map((p) => (
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

/* ── ProductLoadingSkeleton ──────────────────────────────────────────────── */
export function ProductLoadingSkeleton({ count = 6 }: ProductLoadingSkeletonProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-black/5 overflow-hidden p-3 animate-pulse shrink-0 w-[180px]"
        >
          <div className="w-full h-40 rounded-xl bg-gray-200" />
          <div className="mt-3 h-4 bg-gray-200 rounded w-3/4" />
          <div className="mt-2 h-4 bg-gray-200 rounded w-1/2" />
          <div className="mt-1 h-3 bg-gray-200 rounded w-1/3" />
          {/* Skeleton mart badges */}
          <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="h-3 bg-gray-200 rounded w-1/4 mb-1.5" />
            <div className="flex gap-1">
              <div className="h-4 bg-gray-200 rounded-full w-16" />
              <div className="h-4 bg-gray-200 rounded-full w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}