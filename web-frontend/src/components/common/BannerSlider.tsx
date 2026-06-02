import React, { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Banner } from '@/types';
import { cn } from '@/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BannerSkeleton } from '@/components/ui/Skeleton';

interface BannerSliderProps {
  banners?: Banner[];
  isLoading?: boolean;
}

export const BannerSlider: React.FC<BannerSliderProps> = ({ banners, isLoading }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false })
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

  if (isLoading) return <BannerSkeleton />;
  if (!banners || banners.length === 0) return null;

  return (
    <div className="relative group rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {banners.map((banner) => (
            <div 
              key={banner.id} 
              className="relative min-w-0 flex-[0_0_100%] h-[160px] md:h-[220px] lg:h-[280px]"
            >
              <img
                src={banner.image_path}
                alt={banner.title}
                className="absolute block h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute left-4 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-sm backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white focus:outline-none"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      
      <button
        onClick={() => emblaApi?.scrollNext()}
        className="absolute right-4 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-sm backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white focus:outline-none"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => emblaApi?.scrollTo(idx)}
            className={cn(
              "h-2 w-2 rounded-full transition-all",
              idx === selectedIndex ? "w-6 bg-white" : "bg-white/50 hover:bg-white/75"
            )}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
