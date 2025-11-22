'use client';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Tour } from '@/types/tour';
import TourCard from '@/components/shared/Card/TourCard';

interface TourCarouselProps {
  title: string;
  tours: Tour[];
  onAddToWishlist?: (tourID: string) => void;
}

export default function TourCarousel({ title, tours, onAddToWishlist }: TourCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      const newScrollPosition =
        scrollRef.current.scrollLeft +
        (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth',
      });
    }
  };

  if (tours.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {tours.map((tour) => (
            <div key={tour.tourID} className="flex-shrink-0 w-[300px] snap-start">
              <TourCard tour={tour} onAddtoWishlist={onAddToWishlist} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}