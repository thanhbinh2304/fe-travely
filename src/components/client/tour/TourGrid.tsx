'use client';
import {Tour} from '@/types/tour';
import TourCard from '@/components/shared/Card/TourCard';

interface TourGridProps {
    title?: string;
    tours: Tour[];
    onAddToWishlist?: (tourID: string) => void;
}
export default function TourGrid({ title, tours, onAddToWishlist }: TourGridProps) {
  if (tours.length === 0) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          {title && (
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {title}
            </h2>
          )}
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No tours available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            {title}
          </h2>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tours.map((tour) => (
            <TourCard
              key={tour.tourID}
              tour={tour}
              onAddtoWishlist={onAddToWishlist}
            />
          ))}
        </div>
      </div>
    </section>
  );
}