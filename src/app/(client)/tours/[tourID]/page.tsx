'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Tour } from '@/types/tour';
import { tourService } from '@/app/services/tourService';
import { reviewService } from '@/app/services/reviewService';
import { toast } from 'sonner';

// Import components
import TourHeader from '@/components/client/tour/detail/TourHeader';
import TourImageGallery from '@/components/client/tour/detail/TourImageGallery';
import TourDescription from '@/components/client/tour/detail/TourDescription';
import TourItinerary from '@/components/client/tour/detail/TourItinerary';
import InclusionExclusionList from '@/components/client/tour/detail/InclusionExclusionList';
import BookingCard from '@/components/client/tour/detail/BookingCard';
import ReviewsList from '@/components/client/tour/detail/ReviewsList';

export default function TourDetailPage() {
    const params = useParams();
    const router = useRouter();
    const tourID = params.tourID as string;

    const [tour, setTour] = useState<Tour | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (tourID) {
            fetchTourDetail();
        }
    }, [tourID]);

    const fetchTourDetail = async () => {
        try {
            setLoading(true);
            const response = await tourService.show(tourID);
            setTour(response.data);
        } catch (error) {
            console.error('Failed to fetch tour:', error);
            toast.error('Unable to load tour details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Đang tải thông tin tour...</p>
                </div>
            </div>
        );
    }

    if (!tour) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="text-6xl mb-4">🗺️</div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Không tìm thấy tour</h2>
                    <p className="text-gray-600 mb-6">
                        Tour bạn đang tìm không tồn tại hoặc đã bị xóa.
                    </p>
                    <button
                        onClick={() => router.push('/tours')}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Quay lại danh sách tour
                    </button>
                </div>
            </div>
        );
    }

    const averageRating = tour.reviews ? reviewService.calculateAverageRating(tour.reviews) : undefined;

    return (
        <main className="min-h-screen bg-gray-50 pt-20">
            {/* Header */}
            <TourHeader tour={tour} />

            {/* Image Gallery */}
            {tour.images && tour.images.length > 0 && (
                <TourImageGallery images={tour.images} title={tour.title} />
            )}

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description */}
                        <TourDescription description={tour.description} />

                        {/* Inclusions & Exclusions */}
                        <InclusionExclusionList />

                        {/* Itinerary */}
                        {tour.itineraries && tour.itineraries.length > 0 && (
                            <TourItinerary itineraries={tour.itineraries} />
                        )}

                        {/* Reviews */}
                        <ReviewsList reviews={tour.reviews} averageRating={averageRating} />
                    </div>

                    {/* Right Column - Booking Card */}
                    <div className="lg:col-span-1">
                        <BookingCard tour={tour} />
                    </div>
                </div>
            </div>
        </main>
    );
}
