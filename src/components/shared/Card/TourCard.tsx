'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star, Calendar, Users, MapPin } from 'lucide-react';
import { Tour } from '@/types/tour';
import {Review} from '@/types/review';
import { reviewService } from '@/app/services/reviewService';
import { tourService } from '@/app/services/tourService';

interface TourCardProps {
    tour: Tour;
    onAddtoWishlist?: (tourID: string) => void;
}

export default function TourCard ({tour, onAddtoWishlist}: TourCardProps) {
    const [isWishlisted, setIsWishlisted] = useState(false);

    // use helpers from tourService
    const mainImage = tourService.getMainImage(tour);
    const averageRating = tour.reviews 
        ? reviewService.calculateAverageRating(tour.reviews)
        : 0;
    const totalReviews = tour.reviews ?.length || 0;
    const duration = tourService.getTourDuration(tour.startDate, tour.endDate);
    const isAvailable = tourService.isTourAvailable(tour);

    const handleWishlistClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsWishlisted(!isWishlisted);
        onAddtoWishlist?.(tour.tourID);
    };

    return (
        <Link 
            href={`/tours/${tour.tourID}`}
            className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                    src={mainImage}
                    alt={tour.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Wishlist Button */}
                <button
                    onClick={handleWishlistClick}
                    className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform z-10"
                >
                    <Heart 
                        className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                    />
                </button>

                {/* Sold Out Badge */}
                {!isAvailable && (
                    <div className="absolute top-4 left-4">
                        <span className="bg-gray-800 text-white text-xs font-semibold px-3 py-1 rounded">
                            Sold Out
                        </span>
                    </div>
                )}

                {/* Limited Spots Badge */}
                {isAvailable && tour.quantity < 10 && (
                    <div className="absolute bottom-4 left-4">
                        <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded">
                            Only {tour.quantity} spots left
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Destination */}
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                    <MapPin className="w-3 h-3" />
                    <span className="font-semibold uppercase tracking-wide">{tour.destination}</span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-gray-900 text-base mb-3 line-clamp-2 min-h-[3rem] group-hover:text-blue-600 transition-colors">
                    {tour.title}
                </h3>

                {/* Duration & Availability */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{duration} {duration === 1 ? 'day' : 'days'}</span>
                    </div>
                    {isAvailable && (
                        <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{tour.quantity} spots</span>
                        </div>
                    )}
                </div>

                {/* Rating */}
                {totalReviews > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                        i < Math.floor(averageRating)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'fill-gray-300 text-gray-300'
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                            {averageRating.toFixed(1)}
                        </span>
                        <span className="text-sm text-gray-500">
                            ({totalReviews.toLocaleString()})
                        </span>
                    </div>
                )}

                {/* Price */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-xs text-gray-500 mb-1">From</div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-bold text-gray-900">
                                    ${tour.priceAdult.toLocaleString()}
                                </span>
                                <span className="text-xs text-gray-500">/ adult</span>
                            </div>
                            {tour.priceChild > 0 && (
                                <div className="text-xs text-gray-500 mt-1">
                                    ${tour.priceChild.toLocaleString()} / child
                                </div>
                            )}
                        </div>
                    
                        {isAvailable && (
                            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                                Book Now
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
   
}