'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, ChevronLeft, Smile, Star } from 'lucide-react';
import Image from 'next/image';
import { Tour } from '@/types/tour';
import { tourService } from '@/app/services/tourService';
import { reviewService } from '@/app/services/reviewService';
import { wishlistService } from '@/app/services/wishlistService';

export default function WishlistPage() {
    const router = useRouter();
    const [wishlistTours, setWishlistTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAllTours, setShowAllTours] = useState(false);
    const [firstTourImage, setFirstTourImage] = useState<string>('');

    useEffect(() => {
        loadWishlist();
    }, []);

    const loadWishlist = async () => {
        try {
            const tourIDs = await wishlistService.getWishlist();

            if (tourIDs.length > 0) {
                // Fetch first tour details to get image
                try {
                    const response = await tourService.show(tourIDs[0]);
                    const tour = response.data;
                    const image = tour.images?.[0]?.imageUrl ||
                        tour.images?.[0]?.imageURL ||
                        'https://placehold.co/600x400/e5e7eb/6b7280?text=Guest+Wishlist';
                    setFirstTourImage(image);
                } catch (error) {
                    console.error('Error fetching first tour:', error);
                    setFirstTourImage('https://placehold.co/600x400/e5e7eb/6b7280?text=Guest+Wishlist');
                }
            }

            const tours = tourIDs.map(id => ({
                tourID: id,
                title: '',
                description: '',
                quantity: 0,
                priceAdult: 0,
                priceChild: 0,
                destination: '',
                availability: true,
                startDate: '',
                endDate: '',
            })) as Tour[];
            setWishlistTours(tours);
        } catch (error) {
            console.error('Error loading wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (tourID: string) => {
        try {
            await wishlistService.removeFromWishlist(tourID);
            loadWishlist();
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        }
    }; if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <p className="text-gray-500">Đang tải...</p>
            </div>
        );
    }

    // Empty state
    if (wishlistTours.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="mb-8">
                            <svg
                                className="w-64 h-64 mx-auto text-gray-300"
                                viewBox="0 0 200 200"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                {/* Travel illustration */}
                                <path
                                    d="M60 80 L50 90 L70 100 Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                />
                                <rect
                                    x="80"
                                    y="50"
                                    width="40"
                                    height="60"
                                    rx="4"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                />
                                <path
                                    d="M90 60 Q100 50 110 60"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                />
                                <rect x="95" y="75" width="10" height="15" fill="currentColor" />
                                <path
                                    d="M100 90 L100 100"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />
                                <circle cx="130" cy="70" r="5" fill="currentColor" />
                                <path
                                    d="M140 80 L160 70 L150 90"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                />
                                <path
                                    d="M40 130 Q100 120 160 130"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                />
                                <circle cx="70" cy="125" r="3" fill="currentColor" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            Danh sách yêu thích của bạn đang trống
                        </h1>
                        <p className="text-gray-600 mb-8">
                            Lưu các hoạt động vào danh sách yêu thích của bạn bằng cách nhấp vào biểu tượng trái tim.
                        </p>
                        <button
                            onClick={() => router.push('/tours')}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-full transition shadow-lg"
                        >
                            Tìm tour du lịch
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Card view (default view showing count)
    if (!showAllTours) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">
                        Danh sách yêu thích của bạn
                    </h1>

                    <div className="max-w-md">
                        <div
                            onClick={() => setShowAllTours(true)}
                            className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition cursor-pointer"
                        >
                            <div className="relative h-48">
                                <Image
                                    src={firstTourImage || 'https://placehold.co/600x400/e5e7eb/6b7280?text=Guest+Wishlist'}
                                    alt="Guest wishlist"
                                    fill
                                    unoptimized
                                    className="object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = 'https://placehold.co/600x400/e5e7eb/6b7280?text=Guest+Wishlist';
                                    }}
                                />
                                <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-sm font-semibold">
                                    Lưu cục bộ
                                </div>
                            </div>
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-2">
                                    Danh sách khách
                                </h2>
                                <p className="text-blue-600 font-semibold">
                                    {wishlistTours.length} hoạt động
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Detailed view showing all tours
    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <button
                        onClick={() => setShowAllTours(false)}
                        className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span className="ml-1">Quay lại</span>
                    </button>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Danh sách khách</h1>
                            <p className="text-blue-600 font-semibold mt-1">
                                {wishlistTours.length} hoạt động
                            </p>
                        </div>
                        <button className="p-2 hover:bg-gray-100 rounded-full transition">
                            <Smile className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-blue-600 flex items-center justify-center mr-3 mt-0.5">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <p className="text-sm text-gray-700">
                        Lưu cục bộ trên thiết bị này
                    </p>
                </div>

                <div className="space-y-4">
                    {wishlistTours.map((tour) => (
                        <WishlistTourCard
                            key={tour.tourID}
                            tour={tour}
                            onRemove={() => removeFromWishlist(tour.tourID)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

interface WishlistTourCardProps {
    tour: Tour;
    onRemove: () => void;
}

function WishlistTourCard({ tour, onRemove }: WishlistTourCardProps) {
    const [tourDetails, setTourDetails] = useState<Tour | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchTourDetails = async () => {
            try {
                const response = await tourService.show(tour.tourID);
                setTourDetails(response.data);
            } catch (error) {
                console.error('Error fetching tour details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTourDetails();
    }, [tour.tourID]);

    if (loading || !tourDetails) {
        return (
            <div className="bg-white rounded-lg shadow p-4 animate-pulse">
                <div className="flex gap-4">
                    <div className="w-48 h-32 bg-gray-200 rounded"></div>
                    <div className="flex-1">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        );
    }

    const mainImage = tourDetails.images?.[0]?.imageUrl ||
        tourDetails.images?.[0]?.imageURL ||
        'https://placehold.co/600x400/e5e7eb/6b7280?text=No+Image';

    const averageRating = tourDetails.reviews
        ? reviewService.calculateAverageRating(tourDetails.reviews)
        : 0;
    const totalReviews = tourDetails.reviews?.length || 0;

    return (
        <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
            <div className="flex">
                <div className="relative w-64 h-40 flex-shrink-0">
                    <Image
                        src={mainImage}
                        alt={tourDetails.title}
                        fill
                        unoptimized
                        className="object-cover"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://placehold.co/600x400/e5e7eb/6b7280?text=No+Image';
                        }}
                    />
                    <div className="absolute top-3 left-3 bg-yellow-400 w-8 h-8 rounded-full flex items-center justify-center">
                        <span className="text-yellow-900 font-bold text-sm">G</span>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove();
                        }}
                        className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition"
                    >
                        <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                    </button>
                </div>

                <div
                    onClick={() => router.push(`/tours/${tourDetails.tourID}`)}
                    className="flex-1 p-4 cursor-pointer"
                >
                    <div className="mb-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase">
                            TOUR
                        </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-600 transition">
                        {tourDetails.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                        1 ngày • Bỏ qua hàng chờ
                    </p>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`w-4 h-4 ${star <= Math.round(averageRating)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'fill-gray-300 text-gray-300'
                                            }`}
                                    />
                                ))}
                                <span className="text-sm font-bold ml-1">
                                    {averageRating > 0 ? averageRating.toFixed(1) : 'N/A'}
                                </span>
                            </div>
                            <span className="text-sm text-gray-500">
                                ({totalReviews} đánh giá)
                            </span>
                        </div>

                        <div className="text-right">
                            <div className="text-sm text-gray-500">Từ</div>
                            <div className="text-xl font-bold text-gray-900">
                                {Math.round(tourDetails.priceAdult).toLocaleString()}₫
                            </div>
                            <div className="text-xs text-gray-500">mỗi người</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
