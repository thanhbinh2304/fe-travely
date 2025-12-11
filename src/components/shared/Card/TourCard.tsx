'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star, Clock } from 'lucide-react';
import { Tour } from '@/types/tour';
import { reviewService } from '@/app/services/reviewService';
import { tourService } from '@/app/services/tourService';

interface TourCardProps {
    tour: Tour;
    onAddtoWishlist?: (tourID: string) => void;
}

export default function TourCard({ tour, onAddtoWishlist }: TourCardProps) {
    const [isWishlisted, setIsWishlisted] = useState(false);

    const mainImage = tourService.getMainImage(tour);
    const averageRating = tour.reviews
        ? reviewService.calculateAverageRating(tour.reviews)
        : 0;
    const totalReviews = tour.reviews?.length || 0;
    const duration = tourService.getTourDuration(tour.startDate, tour.endDate);

    useEffect(() => {
        // Check if tour is in wishlist
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
            const tourIDs = JSON.parse(savedWishlist) as string[];
            setIsWishlisted(tourIDs.includes(tour.tourID));
        }
    }, [tour.tourID]);

    const handleWishlistClick = (e: React.MouseEvent) => {
        e.preventDefault();

        // Get current wishlist
        const savedWishlist = localStorage.getItem('wishlist');
        let tourIDs: string[] = savedWishlist ? JSON.parse(savedWishlist) : [];

        if (isWishlisted) {
            // Remove from wishlist
            tourIDs = tourIDs.filter(id => id !== tour.tourID);
        } else {
            // Add to wishlist
            tourIDs.push(tour.tourID);
        }

        localStorage.setItem('wishlist', JSON.stringify(tourIDs));
        setIsWishlisted(!isWishlisted);
        onAddtoWishlist?.(tour.tourID);
    };

    return (
        <Link
            href={`/tours/${tour.tourID}`}
            className="group block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                    src={mainImage}
                    alt={tour.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://placehold.co/800x600/e5e7eb/6b7280?text=No+Image';
                    }}
                />

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlistClick}
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:bg-white hover:scale-110 transition-all z-10"
                >
                    <Heart
                        className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-700'}`}
                    />
                </button>

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                        Tour trong ngày
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                {/* Title */}
                <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {tour.title}
                </h3>

                {/* Duration */}
                <div className="flex items-center gap-1.5 text-gray-600 mb-3">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">{duration} ngày</span>
                </div>

                {/* Certified Badge */}
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs text-gray-600 font-medium">Được chứng nhận</span>
                </div>

                {/* Rating */}
                {totalReviews > 0 ? (
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        </div>
                        <span className="text-base font-bold text-gray-900">
                            {averageRating.toFixed(1)}
                        </span>
                        <span className="text-sm text-gray-600">
                            ({Math.round(totalReviews).toLocaleString()})
                        </span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 fill-gray-300 text-gray-300" />
                            <Star className="w-5 h-5 fill-gray-300 text-gray-300" />
                            <Star className="w-5 h-5 fill-gray-300 text-gray-300" />
                            <Star className="w-5 h-5 fill-gray-300 text-gray-300" />
                            <Star className="w-5 h-5 fill-gray-300 text-gray-300" />
                        </div>
                        <span className="text-sm text-gray-500">Chưa có đánh giá</span>
                    </div>
                )}
            </div>
        </Link>
    );
}