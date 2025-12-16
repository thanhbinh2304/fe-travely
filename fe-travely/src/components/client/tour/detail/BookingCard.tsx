'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Users, Heart, ShoppingCart } from 'lucide-react';
import { Tour } from '@/types/tour';
import { toast } from 'sonner';
import { cartService } from '@/app/services/cartService';
import { reviewService } from '@/app/services/reviewService';

interface BookingCardProps {
    tour: Tour;
}

export default function BookingCard({ tour }: BookingCardProps) {
    const router = useRouter();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [selectedDate, setSelectedDate] = useState('');

    const isAvailable = tour.availability && tour.quantity > 0;
    const totalPrice = (adults * tour.priceAdult) + (children * tour.priceChild);

    const handleBookNow = async () => {
        if (!selectedDate) {
            toast.error('Vui lòng chọn ngày khởi hành');
            return;
        }

        if (adults < 1) {
            toast.error('Phải có ít nhất 1 người lớn');
            return;
        }

        try {
            // Get tour image
            const mainImage = tour.images && tour.images.length > 0
                ? tour.images[0].imageUrl
                : '';

            // Calculate average rating
            const averageRating = tour.reviews
                ? reviewService.calculateAverageRating(tour.reviews)
                : 0;

            const calculatedTotalPrice = (tour.priceAdult * adults) + (tour.priceChild * children);

            // Prepare item data for localStorage (guests)
            const itemData = {
                title: tour.title,
                imageUrl: mainImage,
                rating: averageRating,
                reviewCount: tour.reviews?.length || 0,
                time: new Date(tour.startDate).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                language: 'Tiếng Việt',
                freeCancellation: true,
                originalPrice: 0,
                discountedPrice: calculatedTotalPrice,
            };

            // Add to cart first (creates booking if authenticated)
            await cartService.addToCart(
                tour.tourID.toString(),
                selectedDate,
                adults,
                children,
                undefined, // specialRequests
                itemData
            );

            // Then navigate to checkout
            router.push('/checkout');
        } catch (error) {
            console.error('[BookingCard] Error booking now:', error);
            toast.error('Không thể đặt tour, vui lòng thử lại');
        }
    };

    const toggleWishlist = () => {
        setIsWishlisted(!isWishlisted);
        toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    };

    const handleAddToCart = async () => {
        if (!selectedDate) {
            toast.error('Vui lòng chọn ngày khởi hành');
            return;
        }

        if (adults < 1) {
            toast.error('Phải có ít nhất 1 người lớn');
            return;
        }

        try {
            // Get tour image
            const mainImage = tour.images && tour.images.length > 0
                ? tour.images[0].imageUrl
                : '';

            // Calculate average rating
            const averageRating = tour.reviews
                ? reviewService.calculateAverageRating(tour.reviews)
                : 0;

            const totalPrice = (tour.priceAdult * adults) + (tour.priceChild * children);

            // For guests using localStorage, we need to pass the full item data
            const itemData = {
                title: tour.title,
                imageUrl: mainImage,
                rating: averageRating,
                reviewCount: tour.reviews?.length || 0,
                time: new Date(tour.startDate).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                language: 'Tiếng Việt',
                freeCancellation: true,
                originalPrice: 0,
                discountedPrice: totalPrice,
            };

            await cartService.addToCart(
                tour.tourID.toString(),
                selectedDate,
                adults,
                children,
                undefined, // specialRequests
                itemData
            );

            toast.success('Đã thêm vào giỏ hàng!');
        } catch (error) {
            console.error('[BookingCard] Error adding to cart:', error);
            toast.error('Không thể thêm vào giỏ hàng');
        }
    };

    return (
        <div className="sticky top-4 bg-white rounded-xl shadow-lg p-6 space-y-6">
            {/* Price */}
            <div>
                <div className="text-sm text-gray-600 mb-1">Chỉ từ</div>
                <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-gray-900">
                        {Math.round(tour.priceAdult).toLocaleString()} VNĐ
                    </span>
                    <span className="text-gray-600">/ người lớn</span>
                </div>
                {tour.priceChild > 0 && (
                    <div className="text-gray-700">
                        <span className="font-semibold">{Math.round(tour.priceChild).toLocaleString()} VNĐ</span>
                        <span className="text-gray-600"> / trẻ em</span>
                    </div>
                )}
            </div>

            {/* Availability Status */}
            {!isAvailable ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700 font-semibold text-center">
                        Không còn chỗ
                    </p>
                </div>
            ) : tour.quantity < 10 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-700 font-semibold text-center">
                        Chỉ còn {tour.quantity} chỗ!
                    </p>
                </div>
            )}            {/* Date Selection */}
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Chọn ngày
                </label>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!isAvailable}
                />
            </div>

            {/* Travelers */}
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                    <Users className="w-4 h-4 inline mr-1" />
                    Số người
                </label>                {/* Adults */}
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <div className="font-medium text-gray-900">Người lớn</div>
                        <div className="text-sm text-gray-600">Tuổi 13+</div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setAdults(Math.max(1, adults - 1))}
                            disabled={!isAvailable || adults <= 1}
                            className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            −
                        </button>
                        <span className="w-8 text-center font-semibold">{adults}</span>
                        <button
                            onClick={() => setAdults(adults + 1)}
                            disabled={!isAvailable}
                            className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Children */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="font-medium text-gray-900">Trẻ em</div>
                        <div className="text-sm text-gray-600">Tuổi 3-12</div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setChildren(Math.max(0, children - 1))}
                            disabled={!isAvailable}
                            className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            −
                        </button>
                        <span className="w-8 text-center font-semibold">{children}</span>
                        <button
                            onClick={() => setChildren(children + 1)}
                            disabled={!isAvailable}
                            className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>

            {/* Total Price */}
            {(adults > 0 || children > 0) && (
                <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-700">Tổng</span>
                        <span className="text-2xl font-bold text-gray-900">
                            {Math.round(totalPrice).toLocaleString()} VNĐ
                        </span>
                    </div>
                    <div className="text-sm text-gray-600">
                        {adults > 0 && `${adults} người lớn`}
                        {adults > 0 && children > 0 && ' + '}
                        {children > 0 && `${children} trẻ em`}
                    </div>
                </div>
            )}

            {/* Buttons */}
            <div className="space-y-3">
                <button
                    onClick={handleBookNow}
                    disabled={!isAvailable}
                    className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors ${isAvailable
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    {isAvailable ? 'Đặt ngay' : 'Không khả dụng'}
                </button>

                <button
                    onClick={handleAddToCart}
                    disabled={!isAvailable}
                    className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${isAvailable
                        ? 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                        : 'border-2 border-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    <ShoppingCart className="w-5 h-5" />
                    Thêm vào giỏ hàng
                </button>

                <button
                    onClick={toggleWishlist}
                    className="w-full py-3 border-2 border-gray-300 rounded-lg font-semibold flex items-center justify-center gap-2 hover:border-blue-600 hover:text-blue-600 transition-colors"
                >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                    {isWishlisted ? 'Đã lưu' : 'Lưu vào danh sách yêu thích'}
                </button>
            </div>

            {/* Contact */}
            <div className="pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600 mb-2">Cần trợ giúp?</p>
                <a
                    href="tel:1900xxxx"
                    className="text-blue-600 font-semibold hover:text-blue-700"
                >
                    Liên hệ: 1900 xxxx
                </a>
            </div>
        </div>
    );
}
