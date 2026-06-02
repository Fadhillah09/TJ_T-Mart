import { useNavigate } from 'react-router-dom'
import { Zap, Droplets } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useBanners, useKategori, useProdukList } from '../../hooks/useProduk'
import { useCart } from '../../hooks/useCart'
import BannerSlider from '../../components/common/BannerSlider'
import ProductCard from '../../components/common/ProductCard'
import CategoryCard from '../../components/common/CategoryCard'
import { ProductCardSkeleton } from '../../components/ui/Skeleton'
import MainLayout from '../../layouts/MainLayout'
import type { Produk } from '../../types'

export default function Home() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { addToCart } = useCart()

  const { data: bannersData, isLoading: bannersLoading } = useBanners()
  const { data: kategoriData, isLoading: kategoriLoading } = useKategori()
  const { data: produkData, isLoading: produkLoading } = useProdukList({ page: 1 })

  const banners = bannersData ?? []
  const kategoris = kategoriData ?? []
  const produks = produkData?.data.data ?? []

  const handleAddToCart = (produk: Produk) => {
    addToCart(produk.id, 1)
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">

        {/* ── SECTION 1: Hero ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Left: Welcome Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
            <div>
              <p className="text-gray-500 text-sm">Selamat datang,</p>
              <h2 className="text-2xl font-bold text-gray-900">
                <span className="text-[#DC2626]">{user?.name ?? 'Pengguna'}</span>
              </h2>
              {/* Gedung & Kamar badges */}
              {(user?.lokasi || user?.nomor_kamar) && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {user.lokasi && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
                      🏢 {user.lokasi.nama_gedung}
                    </span>
                  )}
                  {user.nomor_kamar && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
                      🏠 Kamar {user.nomor_kamar}
                    </span>
                  )}
                </div>
              )}
              <p className="text-sm text-gray-500 mt-3 leading-relaxed border-l-4 border-[#DC2626] pl-3">
                Permudah penuhi setiap kebutuhan asramamu dengan sistem yang{' '}
                <span className="text-[#DC2626] font-semibold">terintegrasi</span>, cepat, dan aman.
              </p>
            </div>

            {/* Layanan Utama */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
                Layanan Utama
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/token')}
                  className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-[#DC2626] to-[#B91C1C] text-white hover:from-[#B91C1C] hover:to-[#991B1B] transition-all active:scale-98 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <Zap size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm">Token Listrik</p>
                    <p className="text-[10px] text-red-200 font-semibold uppercase tracking-wide">Beli Sekarang</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/galon')}
                  className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-[#DC2626] to-[#B91C1C] text-white hover:from-[#B91C1C] hover:to-[#991B1B] transition-all active:scale-98 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <Droplets size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm">Galon Asrama</p>
                    <p className="text-[10px] text-red-200 font-semibold uppercase tracking-wide">Pesan Antar</p>
                  </div>
                </button>
              </div>
            </div>

            <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-auto">
              ⏱ Layanan terpercaya untuk kebutuhan asrama Anda.
            </p>
          </div>

          {/* Right: Banner */}
          <div className="lg:col-span-3">
            <BannerSlider banners={banners} loading={bannersLoading} />
          </div>
        </div>

        {/* ── SECTION 2: Katalog Terbaru ── */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-bold text-gray-900">Katalog Produk Terbaru</h3>
            <div className="h-0.5 w-8 bg-[#DC2626] rounded-full" />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
            {produkLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-44 snap-start">
                    <ProductCardSkeleton />
                  </div>
                ))
              : produks.slice(0, 8).map((produk) => (
                  <div key={produk.id} className="flex-shrink-0 w-44 snap-start">
                    <ProductCard
                      produk={produk}
                      onAddToCart={handleAddToCart}
                      onWishlist={() => navigate(`/produk/${produk.id}`)}
                    />
                  </div>
                ))}
          </div>
        </div>

        {/* ── SECTION 3: Kategori ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-4">
            Kategori Produk
          </h3>
          {kategoriLoading ? (
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-20 rounded-xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {kategoris.map((kat) => (
                <CategoryCard
                  key={kat.id}
                  kategori={kat}
                  onClick={() => navigate(`/produk?kategori_id=${kat.id}`)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── SECTION 4: Produk Unggulan ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Produk Unggulan</h3>
            <button
              onClick={() => navigate('/produk')}
              className="text-sm font-semibold text-[#DC2626] hover:underline"
            >
              Lihat semua →
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {produkLoading
              ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : produks.map((produk) => (
                  <ProductCard
                    key={produk.id}
                    produk={produk}
                    onAddToCart={handleAddToCart}
                    onWishlist={() => navigate(`/produk/${produk.id}`)}
                  />
                ))}
          </div>
        </div>

      </div>
    </MainLayout>
  )
}