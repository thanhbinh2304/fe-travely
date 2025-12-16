'use client';

import { MapPin, Star, Clock, Calendar } from 'lucide-react';
import { Tour } from '@/types/tour';
import { reviewService } from '@/app/services/reviewService';
import { tourService } from '@/app/services/tourService';

interface TourHeaderProps {
    tour: Tour;
}

export default function TourHeader({ tour }: TourHeaderProps) {
    const averageRating = tour.reviews ? reviewService.calculateAverageRating(tour.reviews) : 0;
    const totalReviews = tour.reviews?.length || 0;
    const duration = tourService.getTourDuration(tour.startDate, tour.endDate);

    return (
        <div className="bg-white border-b">
            <div className="container mx-auto px-4 py-6">
                {/* Breadcrumb / Category */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="font-semibold uppercase tracking-wide">{tour.destination}</span>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {tour.title}
                </h1>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-6">
                    {/* Rating */}
                    {totalReviews > 0 && (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                <span className="text-lg font-bold">{averageRating.toFixed(1)}</span>
                            </div>
                            <span className="text-gray-600">({totalReviews} đánh giá)</span>
                        </div>
                    )}

                    {/* Duration */}
                    <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="w-5 h-5" />
                        <span>{duration} ngày</span>
                    </div>                    {/* Start Date */}
                    <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-5 h-5" />
                        <span>{new Date(tour.startDate).toLocaleDateString('vi-VN')}</span>
                    </div>

                    {/* Availability Badge */}
                    {tour.quantity > 0 && tour.quantity < 10 && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
                            Only {tour.quantity} spots left
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
