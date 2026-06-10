import { useRef, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BannerSlider, { BannerItem } from '@/components/common/BannerSlider';
import { Produk, Banner } from '@/types';
import toast from 'react-hot-toast';

/** Base URL backend Laravel — hanya untuk foto profil user dari storage */
const BACKEND_URL = 'http://127.0.0.1:8000';

/**
 * Resolve URL foto profil user.
 * Backend bisa return foto_url (full URL) atau foto (path relatif storage).
 */
const resolveFotoUrl = (foto?: string, foto_url?: string): string | null => {
  if (foto_url) return foto_url;
  if (foto) {
    if (foto.startsWith('http')) return foto;
    return `${BACKEND_URL}/storage/${foto}`;
  }
  return null;
};

/**
 * Konversi Banner (tipe backend) ke BannerItem (tipe BannerSlider).
 * Diperlukan karena backend pakai image_path, BannerSlider pakai image/image_path.
 */
const toBannerItems = (banners: Banner[]): BannerItem[] =>
  banners.map(b => ({
    id: b.id,
    title: b.title,
    image_path: b.image_path,   // BannerSlider.tsx sudah support image_path
    redirect_url: b.redirect_url,
  }));

interface MainFeaturesProps {
  /** Terima Banner[] dari backend ATAU BannerItem[] dari mock */
  banners?: Banner[] | BannerItem[];
  latestProducts?: Produk[];
}

export default function MainFeatures({ banners = [], latestProducts = [] }: MainFeaturesProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [openAduanModal, setOpenAduanModal] = useState(false);
  const [tipeAduan, setTipeAduan] = useState('Token Listrik');
  const [judulAduan, setJudulAduan] = useState('');
  const [deskripsiAduan, setDeskripsiAduan] = useState('');

  const handleKirimAduan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judulAduan.trim() || !deskripsiAduan.trim()) {
      toast.error('Harap isi judul dan deskripsi aduan.');
      return;
    }
    toast.success('Keluhan Anda berhasil dikirim! Tim kami akan segera menindaklanjuti.');
    setOpenAduanModal(false);
    setJudulAduan('');
    setDeskripsiAduan('');
  };

  const scrollProducts = useCallback((dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  }, []);

  // ── Resolve data user ──────────────────────────────────────────────────
  // Gedung: dari relasi lokasi (user.lokasi.nama_gedung)
  const namaGedung = user?.lokasi?.nama_gedung ?? user?.lokasi?.nama_lokasi ?? null;
  const nomorKamar = user?.nomor_kamar ?? null;

  // Foto profil: foto_url (full URL dari backend) atau foto (path relatif)
  const fotoUrl = resolveFotoUrl(user?.foto, user?.foto_url);

  // Inisial nama untuk avatar fallback
  const inisialNama = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  // ── Normalize banners ke BannerItem[] ─────────────────────────────────
  // Jika array pertama punya `image_path` dan tidak punya `image` = tipe Banner dari backend
  const normalizedBanners: BannerItem[] =
    banners.length > 0 && 'image_path' in banners[0] && !('image' in banners[0])
      ? toBannerItems(banners as Banner[])
      : (banners as BannerItem[]);

  // ── Resolve gambar produk ──────────────────────────────────────────────
  // Prioritas: gambar_url (sudah full URL dari mock/backend)
  // Fallback: gambar (path relatif, coba dari /produk_assets/)
  const resolveGambarUrl = (p: Produk): string => {
    if (p.gambar_url) return p.gambar_url;
    if (p.gambar) {
      if (p.gambar.startsWith('http')) return p.gambar;
      // Ambil nama file saja, serve dari public/produk_assets/
      const filename = p.gambar.split('/').pop() ?? p.gambar;
      return `/produk_assets/${filename}`;
    }
    return '';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-0">
      {/* ── OUTER CARD ── */}
      <div className="bg-white rounded-[1.5rem] shadow-2xl shadow-red-900/5 border border-[#E7BD8A]/20 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">

          {/* ══════════════ LEFT — WELCOME & LAYANAN ══════════════ */}
          <div className="lg:col-span-4 p-6 lg:pt-7 lg:pb-4 bg-gradient-to-br from-white via-[#fff1f1] to-[#fecaca] border-r border-[#E7BD8A]/10 flex flex-col justify-between">
            <div>
              {/* Welcome */}
              <div className="relative mb-1">

                {/* Foto Profil + Nama */}
                <div className="flex items-center gap-3 mb-3">
                  {/* Avatar */}
                  <div className="w-12 h-12 shrink-0 rounded-full overflow-hidden border-2 border-[#dc2626]/30 shadow-md bg-[#dc2626] flex items-center justify-center">
                    {fotoUrl ? (
                      <img
                        src={fotoUrl}
                        alt={user?.name ?? 'Foto profil'}
                        className="w-full h-full object-cover"
                        onError={e => {
                          // Sembunyikan img dan tampilkan fallback inisial
                          (e.target as HTMLImageElement).style.display = 'none';
                          const parent = (e.target as HTMLImageElement).parentElement;
                          if (parent) {
                            parent.innerHTML = `<span class="text-white font-black text-sm">${inisialNama}</span>`;
                          }
                        }}
                      />
                    ) : (
                      <span className="text-white font-black text-sm">{inisialNama}</span>
                    )}
                  </div>

                  <div>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                      Selamat datang,
                    </p>
                    <h2 className="text-2xl font-black text-[#dc2626] leading-tight tracking-tight">
                      {user?.name ?? 'Pengguna'}
                    </h2>
                  </div>
                </div>

                {/* Badges Gedung & Kamar */}
                <div className="mt-2 flex items-center gap-2 text-xs font-bold flex-wrap">
                  {/* Badge Gedung */}
                  <div className="badge-history-style flex items-center gap-2 px-3 py-1.5 rounded-xl">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m-5 0v-2a2 2 0 012-2h10a2 2 0 012 2v2M7 5h10" />
                    </svg>
                    <span className="text-[10px] leading-tight font-bold tracking-wider">
                      {namaGedung ?? 'Gedung -'}
                    </span>
                  </div>

                  {/* Badge Kamar */}
                  <div className="badge-history-style flex items-center gap-2 px-3 py-1.5 rounded-xl">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="text-[10px] leading-tight font-bold tracking-wider">
                      {nomorKamar ? `Kamar ${nomorKamar}` : 'Kamar -'}
                    </span>
                  </div>
                </div>

                {/* Tagline */}
                <div className="mt-5 relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#dc2626] to-transparent rounded-full" />
                  <p className="pl-4 text-gray-500 leading-relaxed text-xs antialiased font-medium">
                    Permudah penuhi setiap kebutuhan asramamu dengan sistem yang{' '}
                    <span className="text-[#dc2626] font-bold">terintegrasi</span>, cepat, dan aman.
                  </p>
                </div>
              </div>

              {/* Layanan Utama */}
              <h4 className="text-[10px] font-extrabold text-[#dc2626] uppercase tracking-[0.2em] mt-6 mb-2 ml-1">
                Layanan Utama
              </h4>

              <div className="flex flex-row md:flex-row lg:flex-col gap-2 lg:gap-1.5">
                {/* Token Listrik */}
                <button
                  onClick={() => navigate('/token')}
                  className="feature-card shining-effect w-full lg:w-auto group flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border-2 border-red-300 hover:border-[#dc2626] hover:shadow-xl hover:shadow-red-900/10 transition-all text-left"
                >
                  <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-[#dc2626] rounded-xl text-white group-hover:bg-[#b91c1c] transition-all duration-300 shadow-lg shadow-red-200">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#5B000B] text-[13px] group-hover:text-[#dc2626]">
                      Token Listrik
                    </h3>
                    <p className="text-[10px] leading-tight text-red-400 font-bold uppercase tracking-tighter">
                      Beli Sekarang
                    </p>
                  </div>
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    <svg className="w-5 h-5 text-[#dc2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </button>

                {/* Galon Asrama */}
                <button
                  onClick={() => navigate('/galon')}
                  className="feature-card shining-effect w-full lg:w-auto group flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border-2 border-red-300 hover:border-[#dc2626] hover:shadow-xl hover:shadow-red-900/10 transition-all text-left"
                >
                  <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-[#dc2626] rounded-xl text-white group-hover:bg-[#b91c1c] transition-all duration-300 shadow-lg shadow-red-200">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 3v1m6-1v1M9 19h6m-7 1h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2zm3-15a3 3 0 016 0v1H9V4z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#5B000B] text-[13px] group-hover:text-[#dc2626]">
                      Galon Asrama
                    </h3>
                    <p className="text-[10px] leading-tight text-red-400 font-bold uppercase tracking-tighter">
                      Pesan Antar
                    </p>
                  </div>
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    <svg className="w-5 h-5 text-[#dc2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </button>
              </div>

              {/* Layanan Pengaduan */}
              <h4 className="text-[10px] font-extrabold text-[#dc2626] uppercase tracking-[0.2em] mt-5 mb-2 ml-1">
                Layanan Pengaduan
              </h4>

              <div className="flex flex-row gap-2 w-full mb-3">
                {/* Aduan via WA */}
                <a
                  href="https://wa.me/6281234567890?text=Halo%20Admin%20TJ-T%20Mart,%20saya%20ingin%20mengajukan%20keluhan."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="feature-card shining-effect flex-1 group flex items-center gap-2.5 px-3 py-2.5 rounded-2xl bg-white border-2 border-red-300 hover:border-[#dc2626] hover:shadow-xl hover:shadow-red-900/10 transition-all text-left"
                >
                  <div className="w-10 h-10 shrink-0 flex items-center justify-center bg-[#dc2626] rounded-xl text-white group-hover:bg-[#b91c1c] transition-all duration-300 shadow-md">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#5B000B] text-[11px] group-hover:text-[#dc2626] leading-tight">
                      Aduan WA
                    </h3>
                    <p className="text-[8px] leading-tight text-red-400 font-bold uppercase tracking-tighter mt-0.5">
                      Chat Admin
                    </p>
                  </div>
                </a>

                {/* Aduan Web */}
                <button
                  onClick={() => setOpenAduanModal(true)}
                  className="feature-card shining-effect flex-1 group flex items-center gap-2.5 px-3 py-2.5 rounded-2xl bg-white border-2 border-red-300 hover:border-[#dc2626] hover:shadow-xl hover:shadow-red-900/10 transition-all text-left cursor-pointer"
                >
                  <div className="w-10 h-10 shrink-0 flex items-center justify-center bg-[#dc2626] rounded-xl text-white group-hover:bg-[#b91c1c] transition-all duration-300 shadow-md">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#5B000B] text-[11px] group-hover:text-[#dc2626] leading-tight">
                      Aduan Web
                    </h3>
                    <p className="text-[8px] leading-tight text-red-400 font-bold uppercase tracking-tighter mt-0.5">
                      Kirim Langsung
                    </p>
                  </div>
                </button>
              </div>

              {/* Trust tagline */}
              <div className="mt-0 pt-0 border-t border-gray-100/60 hidden lg:block">
                <div className="flex items-center gap-2 opacity-60">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#5B000B]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-7.5l2.5-2.5 1.5 1.5-4 4-2.5-2.5 1.5-1.5 1 1z" />
                    </svg>
                  </div>
                  <p className="text-[11px] font-medium text-gray-800 leading-snug">
                    Layanan terpercaya untuk kebutuhan asrama Anda.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════ RIGHT — BANNER + KATALOG ══════════════ */}
          <div className="lg:col-span-8 bg-white flex flex-col">

            {/* Banner */}
            <div className="relative overflow-hidden border-b border-[#dc2626]/10">
              <BannerSlider banners={normalizedBanners} compact />
            </div>

            {/* Katalog Produk Terbaru */}
            <div className="p-6 lg:pt-7 lg:pb-4">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-xl font-black text-[#5B000B]">Katalog Produk Terbaru</h3>
                  <div className="h-1 w-10 bg-[#dc2626] rounded-full mt-1.5" />
                </div>
              </div>

              <div className="relative group/katalog">
                {/* Arrow Buttons */}
                <button
                  onClick={() => scrollProducts('left')}
                  className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-xl border border-red-100 p-2 rounded-full text-[#dc2626] hover:bg-[#dc2626] hover:text-white transition-all duration-300 opacity-100 lg:opacity-0 lg:group-hover/katalog:opacity-100 items-center justify-center"
                >
                  <ChevronLeft size={20} strokeWidth={3} />
                </button>
                <button
                  onClick={() => scrollProducts('right')}
                  className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-xl border border-red-100 p-2 rounded-full text-[#dc2626] hover:bg-[#dc2626] hover:text-white transition-all duration-300 opacity-100 lg:opacity-0 lg:group-hover/katalog:opacity-100 items-center justify-center"
                >
                  <ChevronRight size={20} strokeWidth={3} />
                </button>

                {/* Scrollable Product Cards */}
                <div
                  ref={scrollRef}
                  className="flex gap-5 overflow-x-auto pb-3 -mx-2 px-2 snap-x snap-mandatory scroll-smooth product-scrollbar"
                >
                  {latestProducts.length === 0 ? (
                    // Skeleton loading jika produk belum ada
                    Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="snap-start shrink-0 w-[160px]">
                        <div className="aspect-square rounded-[1.2rem] bg-gray-100 animate-pulse" />
                      </div>
                    ))
                  ) : (
                    latestProducts.map(product => {
                      const gambar = resolveGambarUrl(product);
                      return (
                        <div
                          key={product.id}
                          className="relative pt-2 snap-start shrink-0 w-[160px]"
                          style={{ perspective: '1000px' }}
                        >
                          <button
                            onClick={() => navigate(`/produk/${product.id}`)}
                            className="group/item block w-full relative aspect-square rounded-[1.2rem] overflow-hidden border-2 border-red-50 bg-white shadow-sm hover:shadow-2xl hover:border-red-500 transition-all duration-500 transform hover:-translate-y-1"
                          >
                            {/* Product Image */}
                            <img
                              src={gambar || 'https://images.unsplash.com/photo-1599599810694-e1b42fc85b72?w=400&q=80'}
                              alt={product.nama_produk}
                              className="w-full h-full object-cover transition-transform duration-1000 group-hover/item:scale-110 group-hover/item:rotate-2"
                              onError={e => {
                                (e.target as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1599599810694-e1b42fc85b72?w=400&q=80';
                              }}
                            />

                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#dc2626] via-[#dc2626]/20 to-transparent opacity-0 group-hover/item:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                              <p className="text-white font-bold text-[11px] leading-tight translate-y-2 group-hover/item:translate-y-0 transition-transform duration-300 truncate">
                                {product.nama_produk}
                              </p>
                              <span className="text-[9px] text-red-100 font-medium opacity-0 group-hover/item:opacity-100 transition-opacity delay-100">
                                Klik untuk detail ➔
                              </span>
                            </div>

                            {/* NEW badge */}
                            <div className="absolute top-2.5 left-2.5">
                              <div className="new-badge-pulse bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-lg text-[8px] font-black text-[#dc2626] flex items-center gap-1 shadow-sm border border-red-100">
                                <span className="relative flex h-1.5 w-1.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-600" />
                                </span>
                                NEW
                              </div>
                            </div>
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── ADUAN MODAL ── */}
      {openAduanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpenAduanModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-pop border border-[#E7BD8A]/20">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-[#5B000B] text-base">Buat Pengaduan Web</h3>
                <p className="text-[10px] text-gray-500 mt-0.5">Kirim keluhan Anda langsung melalui sistem</p>
              </div>
              <button
                type="button"
                onClick={() => setOpenAduanModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-400 hover:text-[#dc2626] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleKirimAduan} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-gray-700 font-bold text-xs">
                  Tipe Masalah <span className="text-red-500">*</span>
                </label>
                <select
                  value={tipeAduan}
                  onChange={e => setTipeAduan(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] outline-none bg-white font-medium text-gray-800"
                >
                  <option value="Token Listrik">Token Listrik</option>
                  <option value="Galon Asrama">Galon Asrama</option>
                  <option value="Fasilitas Kamar">Fasilitas Kamar</option>
                  <option value="Kebersihan">Kebersihan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-gray-700 font-bold text-xs">
                  Judul Keluhan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Token belum masuk ke riwayat"
                  value={judulAduan}
                  onChange={e => setJudulAduan(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] outline-none font-medium text-gray-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-gray-700 font-bold text-xs">
                  Deskripsi Keluhan <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Jelaskan secara detail masalah Anda..."
                  value={deskripsiAduan}
                  onChange={e => setDeskripsiAduan(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] outline-none resize-none font-medium text-gray-800"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-[#dc2626] hover:bg-[#b91c1c] text-white shadow-md shadow-red-100 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
              >
                Kirim Keluhan
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── STYLES ── */}
      <style>{`
        .feature-card { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .feature-card:hover { transform: translateY(-5px); }

        .shining-effect { position: relative; overflow: hidden; }
        .shining-effect::after {
          content: "";
          position: absolute;
          top: -50%; left: -60%;
          width: 20%; height: 200%;
          background: rgba(255,255,255,0.2);
          transform: rotate(30deg);
        }
        .shining-effect:hover::after {
          animation: shine 0.8s forwards;
        }
        @keyframes shine { 100% { left: 125%; } }

        .badge-history-style {
          transition: all 0.3s ease;
          background-color: #ffffff;
          border: 0.3px solid rgba(220, 38, 38, 0.5);
          color: #dc2626;
          box-shadow: 0 2px 6px rgba(220, 38, 38, 0.15);
        }
        .badge-history-style:hover {
          box-shadow: 0 6px 15px rgba(220, 38, 38, 0.3);
          border-color: #dc2626;
          transform: translateY(-2px);
          background-color: rgba(254, 226, 226, 0.5);
        }

        .product-scrollbar { scrollbar-width: thin; scrollbar-color: #dc2626 #fef2f2; }
        .product-scrollbar::-webkit-scrollbar { height: 8px; }
        .product-scrollbar::-webkit-scrollbar-track { background: #fef2f2; border-radius: 999px; }
        .product-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to right, #dc2626, #b91c1c);
          border-radius: 999px;
        }
        .product-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to right, #b91c1c, #991b1b);
        }

        .new-badge-pulse { animation: badge-pulse 2s infinite; }
        @keyframes badge-pulse {
          0% { box-shadow: 0 0 0 0 rgba(220,38,38,0.4); }
          70% { box-shadow: 0 0 0 6px rgba(220,38,38,0); }
          100% { box-shadow: 0 0 0 0 rgba(220,38,38,0); }
        }
      `}</style>
    </div>
  );
}