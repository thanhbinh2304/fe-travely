'use client';

import { Star } from 'lucide-react';
import { Review } from '@/types/review';

interface ReviewsListProps {
    // reviews can be an array or a paginator object with .data and .total/meta.total
    reviews?: Review[] | any;
    averageRating?: number;
}

export default function ReviewsList({ reviews, averageRating }: ReviewsListProps) {
    // Normalize reviews array and total count from possible backend shapes
    const reviewsArray: Review[] = Array.isArray(reviews)
        ? reviews
        : reviews && Array.isArray(reviews.data)
            ? reviews.data
            : [];

    const totalCount: number = (() => {
        if (Array.isArray(reviews)) return reviews.length;
        if (!reviews) return 0;
        if (typeof reviews.total === 'number') return reviews.total;
        if (reviews.meta && typeof reviews.meta.total === 'number') return reviews.meta.total;
        if (Array.isArray(reviews.data)) return reviews.data.length;
        return 0;
    })();

    if (totalCount === 0) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Đánh giá</h2>
                <p className="text-gray-600">Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá tour này!</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    Đánh giá ({totalCount})
                </h2>
                {averageRating !== undefined && (
                    <div className="flex items-center gap-2">
                        <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                        <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
                        <span className="text-gray-600">/ 5</span>
                    </div>
                )}
            </div>

            <div className="space-y-6">
                {reviewsArray.map((review) => (
                    <div key={review.reviewID} className="border-b border-gray-200 pb-6 last:border-0">
                        <div className="flex items-start gap-4">
                            {/* Avatar */}
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center font-bold text-lg shrink-0">
                                {review.user?.userName?.charAt(0).toUpperCase() || 'U'}
                            </div>

                            <div className="flex-1">
                                {/* User Info */}
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h4 className="font-semibold text-gray-900">
                                            {review.user?.userName || 'Anonymous'}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            {review.created_at ? new Date(review.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            }) : 'Recently'}
                                        </p>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < review.rating
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'fill-gray-300 text-gray-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Comment */}
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {review.comment}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
