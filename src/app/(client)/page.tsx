'use client';
import React, { useEffect, useState } from 'react';
import Banner from '@/components/client/banner';
import TourCard from '@/components/shared/Card/TourCard';
import { tourService } from '@/app/services/tourService';
import { Tour } from '@/types/tour';

export default function Homepage() {
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([]);
  const [availableTours, setAvailableTours] = useState<Tour[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingAvailable, setLoadingAvailable] = useState(true);

  useEffect(() => {
    const fetchFeaturedTours = async () => {
      try {
        setLoadingFeatured(true);
        const response = await tourService.featured(8);
        // Handle nested data structure from paginated response
        const data = response.data as any;
        const tours = data?.data
          ? (Array.isArray(data.data) ? data.data : [])
          : (Array.isArray(response.data) ? response.data : []);
        setFeaturedTours(tours);
      } catch (error) {
        console.error('Error fetching featured tours:', error);
        setFeaturedTours([]);
      } finally {
        setLoadingFeatured(false);
      }
    };

    const fetchAvailableTours = async () => {
      try {
        setLoadingAvailable(true);
        const response = await tourService.available({ limit: 8 });
        // Handle nested data structure from paginated response
        const data = response.data as any;
        const tours = data?.data
          ? (Array.isArray(data.data) ? data.data : [])
          : (Array.isArray(response.data) ? response.data : []);
        setAvailableTours(tours);
      } catch (error) {
        console.error('Error fetching available tours:', error);
        setAvailableTours([]);
      } finally {
        setLoadingAvailable(false);
      }
    };

    fetchFeaturedTours();
    fetchAvailableTours();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Banner chỉ hiển thị ở trang chủ */}
      <Banner />

      {/* Content */}
      <div>
        {/* Featured Tours section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8">Tour Nổi Bật</h2>
          {loadingFeatured ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Đang tải tour...</p>
            </div>
          ) : featuredTours.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Hiện tại chưa có tour nổi bật.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredTours.map((tour) => (
                <TourCard key={tour.tourID} tour={tour} />
              ))}
            </div>
          )}
        </section>

        {/* Available Tours section */}
        <section className="container mx-auto px-4 py-16 bg-gray-50">
          <h2 className="text-3xl font-bold mb-8">Tour Khả Dụng</h2>
          {loadingAvailable ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Đang tải tour...</p>
            </div>
          ) : availableTours.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Hiện tại chưa có tour khả dụng.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {availableTours.map((tour) => (
                <TourCard key={tour.tourID} tour={tour} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
