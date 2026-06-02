import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { BannerSkeleton } from '../ui/Skeleton'
import type { Banner } from '../../types'

interface BannerSliderProps {
  banners: Banner[]
  loading?: boolean
}

export default function BannerSlider({ banners, loading }: BannerSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  if (loading) return <BannerSkeleton />

  if (!banners.length) return (
    <div className="w-full h-[220px] rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
      Tidak ada banner
    </div>
  )

  return (
    <div className="relative group rounded-xl overflow-hidden">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {banners.map((banner) => (
            <div key={banner.id} className="flex-[0_0_100%] min-w-0">
              {banner.redirect_url ? (
                <a href={banner.redirect_url}>
                  <img
                    src={`http://127.0.0.1:8000/storage/${banner.image_path}`}
                    alt={banner.title}
                    className="w-full h-[160px] md:h-[220px] lg:h-[280px] object-cover"
                  />
                </a>
              ) : (
                <img
                  src={`http://127.0.0.1:8000/storage/${banner.image_path}`}
                  alt={banner.title}
                  className="w-full h-[160px] md:h-[220px] lg:h-[280px] object-cover"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-white"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-white"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}