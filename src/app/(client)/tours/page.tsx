'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import TourGrid from '@/components/client/tour/TourGrid';
import TourCarousel from '@/components/client/tour/TourCarousel';
import { Tour } from '@/types/tour';
import { tourService } from '@/app/services/tourService';
import { reviewService } from '../../services/reviewService';

export default function ToursPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search');
  const [allTours, setAllTours] = useState<Tour[]>([]);
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<Tour[]>([]);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        // If there's a search query, use search API
        if (searchQuery) {
          const searchResponse = await tourService.search({ keyword: searchQuery });
          const _searchData: any = (searchResponse as any).data;
          const searchData = Array.isArray(_searchData) ? _searchData : (_searchData?.data ?? []);
          setSearchResults(searchData);
          setAllTours([]);
          setFeaturedTours([]);
        } else {
          // Get available tours
          const availableResponse = await tourService.available({ limit: 12 });
          const _availData: any = (availableResponse as any).data;
          const availableData = Array.isArray(_availData) ? _availData : (_availData?.data ?? []);
          setAllTours(availableData);

          // Get featured tours
          const featuredResponse = await tourService.featured(8);
          const _featData: any = (featuredResponse as any).data;
          const featuredData = Array.isArray(_featData) ? _featData : (_featData?.data ?? []);
          setFeaturedTours(featuredData);
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Failed to fetch tours:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [searchQuery]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  }

  // Show search results if searching
  if (searchQuery) {
    return (
      <main className="min-h-screen bg-white pt-20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-4">Kết quả tìm kiếm cho: "{searchQuery}"</h1>
          <p className="text-gray-600 mb-6">Tìm thấy {searchResults.length} tour</p>
        </div>
        <TourGrid
          tours={searchResults}
        />
      </main>
    );
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
