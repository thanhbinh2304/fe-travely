'use client';
import { useEffect, useState } from 'react';
import TourGrid from '@/components/client/tour/TourGrid';
import TourCarousel from '@/components/client/tour/TourCarousel';
import { Tour } from '@/types/tour';
import { tourService } from '@/app/services/tourService';
import { reviewService } from '../../services/reviewService';

export default function ToursPage() {
  const [allTours, setAllTours] = useState<Tour[]>([]);
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        // Get available tours
        const availableResponse = await tourService.available({ limit: 12 });
        // Backend may return either an array or a paginated envelope { data: [...] }
        const _availData: any = (availableResponse as any).data;
        const availableData = Array.isArray(_availData) ? _availData : (_availData?.data ?? []);
        console.log('Available tours:', availableData);
        console.log('First tour images:', availableData[0]?.images);
        setAllTours(availableData);

        // Get featured tours
        const featuredResponse = await tourService.featured(8);
        const _featData: any = (featuredResponse as any).data;
        const featuredData = Array.isArray(_featData) ? _featData : (_featData?.data ?? []);
        console.log('Featured tours:', featuredData);
        console.log('First featured tour images:', featuredData[0]?.images);
        setFeaturedTours(featuredData);
      } catch (error) {
        console.error('Failed to fetch tours:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  }

  return (
    <main className="min-h-screen bg-white pt-20">
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
