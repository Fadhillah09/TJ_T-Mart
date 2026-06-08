import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/* ── Local Banner Type (tidak bergantung @/types) ── */
export interface BannerItem {
  id: number;
  title?: string;
  subtitle?: string;
  image?: string;
  gradient?: string;
  redirect_url?: string;
}

interface BannerSliderProps {
  /** Data banner dari API/props (opsional, fallback ke mock data) */
  banners?: BannerItem[];
  /** Mode compact: tinggi lebih kecil, tanpa rounded, dipakai di MainFeatures */
  compact?: boolean;
}

/* ── Mock data fallback ─────────────────────────────────────────────────── */
const MOCK_BANNERS = [
  {
    id: 1,
    title: 'Minuman Segar Tiap Hari',
    subtitle: 'Pocari, Yakult, Aqua — tersedia di semua mart asrama',
    image: 'https://images.unsplash.com/photo-1523677745891-6f3031224c94?w=1400&h=500&fit=crop&q=80',
    gradient: 'from-orange-500/80 via-orange-600/60 to-transparent',
    redirect_url: '#',
  },
  {
    id: 2,
    title: 'Makanan Siap Saji & Snack',
    subtitle: 'Indomie, nugget, sarden, dan banyak lagi dengan harga terjangkau',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1400&h=500&fit=crop&q=80',
    gradient: 'from-red-600/80 via-red-700/60 to-transparent',
    redirect_url: '#',
  },
  {
    id: 3,
    title: 'Promo Pizza Spesial Malam',
    subtitle: 'Dapatkan harga terbaik untuk pembelian di atas Rp 50.000',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1400&h=500&fit=crop&q=80',
    gradient: 'from-yellow-600/80 via-orange-500/60 to-transparent',
    redirect_url: '#',
  },
  {
    id: 4,
    title: 'Belanja Hemat Setiap Hari',
    subtitle: 'Diskon hingga 50% untuk kategori pilihan setiap minggu',
    image: 'https://images.unsplash.com/photo-1488459716781-6918f6066d5f?w=1400&h=500&fit=crop&q=80',
    gradient: 'from-pink-600/80 via-red-500/60 to-transparent',
    redirect_url: '#',
  },
];

const BannerSlider: React.FC<BannerSliderProps> = ({ banners, compact = false }) => {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Gunakan data asli jika tersedia, fallback ke mock
  const slides = (banners && banners.length > 0 ? banners : MOCK_BANNERS) as BannerItem[];
  const total = slides.length;

  const next = useCallback(() => setCurrent(c => (c + 1) % total), [total]);
  const prev = useCallback(() => setCurrent(c => (c - 1 + total) % total), [total]);
  const goTo = useCallback((idx: number) => setCurrent(idx), []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!isHovered && total > 1) {
      timerRef.current = setInterval(next, 5000);
    }
  }, [next, isHovered, total]);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  /* ── Height classes ─────────────────────────────────────────────────── */
  const heightClass = compact
    ? 'h-24 md:h-28 lg:h-32'
    : 'h-64 sm:h-80 md:h-96';

  const wrapperClass = compact
    ? 'relative w-full overflow-hidden group/banner'
    : 'relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group/banner cursor-grab active:cursor-grabbing';

  return (
    <div
      className={wrapperClass}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides */}
      <div className={`relative w-full ${heightClass} overflow-hidden bg-gray-900`}>
        {slides.map((banner, idx) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover/banner:scale-105"
              loading={idx === current ? 'eager' : 'lazy'}
              onError={e => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1523677745891-6f3031224c94?w=1400&h=500&fit=crop&q=80';
              }}
            />

            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/30 to-transparent`} />
            <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient ?? 'from-black/40 via-transparent to-transparent'}`} />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#dc2626] to-transparent opacity-50" />

            {/* Content — hanya tampil di mode full */}
            {!compact && (
              <div className="absolute inset-0 flex items-center px-6 sm:px-8 md:px-12 py-8">
                <div className="max-w-xl">
                  <div className="inline-flex items-center gap-2 mb-3 sm:mb-4">
                    <span className="inline-block px-3 py-1.5 bg-gradient-to-r from-[#d50d27] to-[#ba0015] text-white text-[10px] sm:text-xs font-black rounded-full tracking-wider uppercase shadow-lg shadow-[#d50d27]/50">
                      SPESIAL ASRAMA
                    </span>
                    <span className="hidden sm:inline-block text-white/70 text-xs font-bold">⭐ Best Deal</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2 sm:mb-3 leading-tight drop-shadow-lg">
                    {banner.title}
                  </h2>
                  <p className="text-sm sm:text-base text-white/90 mb-4 sm:mb-6 leading-relaxed drop-shadow">
                    {banner.subtitle}
                  </p>
                  <button className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-[#d50d27] to-[#ba0015] text-white font-bold text-sm sm:text-base rounded-full hover:shadow-xl hover:shadow-[#d50d27]/50 hover:scale-105 transition-all duration-300 active:scale-95 inline-flex items-center gap-2">
                    <span>Belanja Sekarang</span>
                    <span className="text-lg">→</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Nav Arrows */}
      {total > 1 && (
        <>
          <button
            onClick={() => { prev(); resetTimer(); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/90 backdrop-blur-md text-white hover:text-[#dc2626] p-1.5 rounded-full transition-all opacity-0 group-hover/banner:opacity-100 z-10 border border-white/30"
            aria-label="Previous"
          >
            <ChevronLeft size={16} strokeWidth={3} />
          </button>
          <button
            onClick={() => { next(); resetTimer(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/90 backdrop-blur-md text-white hover:text-[#dc2626] p-1.5 rounded-full transition-all opacity-0 group-hover/banner:opacity-100 z-10 border border-white/30"
            aria-label="Next"
          >
            <ChevronRight size={16} strokeWidth={3} />
          </button>
        </>
      )}

      {/* Dots */}
      {total > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => { goTo(idx); resetTimer(); }}
              aria-label={`Slide ${idx + 1}`}
              className={`rounded-full bg-white/40 backdrop-blur-sm transition-all duration-500 hover:bg-white ${
                idx === current ? 'w-6 h-1.5 bg-white' : 'w-2 h-1.5'
              }`}
            />
          ))}
        </div>
      )}

      {/* Counter — hanya di mode full */}
      {!compact && (
        <div className="absolute top-4 right-4 z-20 bg-black/50 text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
          {current + 1} / {total}
        </div>
      )}
    </div>
  );
};

export default BannerSlider;