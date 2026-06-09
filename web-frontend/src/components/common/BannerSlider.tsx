import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface BannerItem {
  id: number;
  title?: string;
  subtitle?: string;
  /** Dari mock/local: URL langsung */
  image?: string;
  /** Dari backend API: field image_path (Banner type) */
  image_path?: string;
  redirect_url?: string;
}

interface BannerSliderProps {
  banners?: BannerItem[];
  compact?: boolean;
}

/** Resolve gambar dari banner — support image langsung atau image_path dari backend */
const resolveImage = (banner: BannerItem): string => {
  if (banner.image) return banner.image;
  if (banner.image_path) return banner.image_path;
  return 'https://images.unsplash.com/photo-1488459716781-6918f6066d5f?w=1400&h=500&fit=crop&q=80';
};

const FALLBACK_BANNERS: BannerItem[] = [
  {
    id: 1,
    title: 'Minuman Segar Tiap Hari',
    subtitle: 'Pocari, Yakult, Aqua — tersedia di semua mart asrama',
    image: 'https://images.unsplash.com/photo-1523677745891-6f3031224c94?w=1400&h=500&fit=crop&q=80',
    redirect_url: '#',
  },
  {
    id: 2,
    title: 'Makanan Siap Saji & Snack',
    subtitle: 'Indomie, nugget, sarden, dan banyak lagi dengan harga terjangkau',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1400&h=500&fit=crop&q=80',
    redirect_url: '#',
  },
  {
    id: 3,
    title: 'Promo Spesial Malam',
    subtitle: 'Dapatkan harga terbaik untuk pembelian di atas Rp 50.000',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1400&h=500&fit=crop&q=80',
    redirect_url: '#',
  },
  {
    id: 4,
    title: 'Belanja Hemat Setiap Hari',
    subtitle: 'Diskon hingga 50% untuk kategori pilihan setiap minggu',
    image: 'https://images.unsplash.com/photo-1488459716781-6918f6066d5f?w=1400&h=500&fit=crop&q=80',
    redirect_url: '#',
  },
];

const BannerSlider: React.FC<BannerSliderProps> = ({ banners, compact = false }) => {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slides = (banners && banners.length > 0 ? banners : FALLBACK_BANNERS) as BannerItem[];
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

  // compact: tinggi lebih besar agar terlihat jelas di homepage
  const heightClass = compact
    ? 'h-44 md:h-52 lg:h-60'
    : 'h-64 sm:h-80 md:h-96';

  const wrapperClass = compact
    ? 'relative w-full overflow-hidden group/banner'
    : 'relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm border border-gray-200 group/banner cursor-grab active:cursor-grabbing';

  return (
    <div
      className={wrapperClass}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides Container */}
      <div className={`relative w-full ${heightClass} overflow-hidden bg-gradient-to-br from-[#b91c1c] to-[#7f1d1d]`}>
        {slides.map((banner, idx) => {
          const imgSrc = resolveImage(banner);
          return (
            <div
              key={banner.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                idx === current ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
              }`}
            >
              {/* Gambar Banner */}
              <img
                src={imgSrc}
                alt={banner.title ?? `Banner ${idx + 1}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover/banner:scale-105"
                loading={idx === current ? 'eager' : 'lazy'}
                onError={e => {
                  const target = e.target as HTMLImageElement;
                  // Sembunyikan gambar yang gagal load — parent bg-gray-200 tetap terlihat
                  target.style.opacity = '0';
                }}
              />

              {/* Overlay gradasi ringan agar teks terbaca */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent z-10" />

              {/* Content — tampil di mode compact juga (ringkas) */}
              {compact ? (
                <div className="absolute inset-0 flex items-end px-5 pb-4 z-20">
                  {banner.title && (
                    <p className="text-white font-black text-sm drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] line-clamp-1">
                      {banner.title}
                    </p>
                  )}
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center px-6 sm:px-8 md:px-12 py-8 z-20">
                  <div className="max-w-xl">
                    <div className="inline-flex items-center gap-2 mb-3 sm:mb-4">
                      <span className="inline-block px-3 py-1.5 bg-gradient-to-r from-[#d50d27] to-[#ba0015] text-white text-[10px] sm:text-xs font-black rounded-full tracking-wider uppercase shadow-md shadow-[#d50d27]/40">
                        SPESIAL ASRAMA
                      </span>
                      <span className="hidden sm:inline-block text-white text-xs font-bold bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-xs">
                        ⭐ Best Deal
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2 sm:mb-3 leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                      {banner.title}
                    </h2>

                    {banner.subtitle && (
                      <p className="text-sm sm:text-base text-white font-medium mb-4 sm:mb-6 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                        {banner.subtitle}
                      </p>
                    )}

                    <button className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-[#d50d27] to-[#ba0015] text-white font-bold text-sm sm:text-base rounded-full hover:shadow-xl hover:shadow-[#d50d27]/50 hover:scale-105 transition-all duration-300 active:scale-95 inline-flex items-center gap-2">
                      <span>Belanja Sekarang</span>
                      <span className="text-lg">→</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Nav Arrows */}
      {total > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); resetTimer(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-white text-white hover:text-[#dc2626] p-2 rounded-full transition-all opacity-0 group-hover/banner:opacity-100 z-30 backdrop-blur-xs shadow-md"
            aria-label="Previous"
          >
            <ChevronLeft size={20} strokeWidth={3} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); resetTimer(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-white text-white hover:text-[#dc2626] p-2 rounded-full transition-all opacity-0 group-hover/banner:opacity-100 z-30 backdrop-blur-xs shadow-md"
            aria-label="Next"
          >
            <ChevronRight size={20} strokeWidth={3} />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {total > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.stopPropagation(); goTo(idx); resetTimer(); }}
              aria-label={`Slide ${idx + 1}`}
              className={`rounded-full transition-all duration-500 shadow-md ${
                idx === current
                  ? 'w-6 h-2 bg-white'
                  : 'w-2 h-2 bg-white/50 hover:bg-white'
              }`}
            />
          ))}
        </div>
      )}

      {/* Counter - Top Right (non-compact only) */}
      {!compact && (
        <div className="absolute top-4 right-4 z-30 bg-black/60 text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-xs shadow-sm">
          {current + 1} / {total}
        </div>
      )}
    </div>
  );
};

export default BannerSlider;