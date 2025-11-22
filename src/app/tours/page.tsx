'use client';
import { useEffect, useState } from 'react';
import TourGrid from '@/components/client/tour/TourGrid';
import TourCarousel from '@/components/client/tour/TourCarousel';
import { Tour } from '@/types/tour';
import { tourService } from '@/app/services/tourService';
import { reviewService } from '../services/reviewService';

export default function ToursPage() {
  const [allTours, setAllTours] = useState<Tour[]>([]);
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        // Get available tours
        const availableResponse = await tourService.available({ limit: 12 });
        setAllTours(availableResponse.data);

        // Get featured tours
        const featuredResponse = await tourService.featured(8);
        setFeaturedTours(featuredResponse.data);
      } catch (error) {
        console.error('Failed to fetch tours:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-white">
      <TourCarousel
        title="Featured Tours"
        tours={featuredTours}
      />

      <TourGrid
        title="Available Tours"
        tours={allTours}
      />
    </main>
  );
}
