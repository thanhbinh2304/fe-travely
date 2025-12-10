import { Review } from "@/types/review";
const API_URL = process.env.NEXT_PUBLIC_SERVER_API || 'http://127.0.0.1:8000/api';

interface ReviewFilters {
    tourID?: number;
    rating?: number;
    verified_only?: boolean;
    status?: 'pending' | 'approved' | 'hidden';
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
}

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

interface PaginatedResponse<T> {
    success: boolean;
    data: {
        current_page: number;
        data: T[];
        total: number;
        per_page: number;
    };
}

class ReviewService {
    private getHeaders(includeAuth = false) {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
        if (includeAuth) {
            const token = this.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return headers;
    }

    private getToken(): string | null {
        if (typeof window === 'undefined') return null;
        const cookieToken = this.getCookie('access_token');
        if (cookieToken) return cookieToken;
        return localStorage.getItem('access_token');
    }

    private getCookie(name: string): string | null {
        if (typeof document === 'undefined') return null;
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
        return null;
    }

    // ==================== PUBLIC METHODS ====================

    // Get all approved reviews
    async getReviews(filters?: ReviewFilters): Promise<Review[]> {
        try {
            const queryParams = new URLSearchParams();

            if (filters?.tourID) queryParams.append('tourID', filters.tourID.toString());
            if (filters?.rating) queryParams.append('rating', filters.rating.toString());
            if (filters?.verified_only) queryParams.append('verified_only', 'true');
            if (filters?.sort_by) queryParams.append('sort_by', filters.sort_by);
            if (filters?.sort_order) queryParams.append('sort_order', filters.sort_order);
            if (filters?.per_page) queryParams.append('per_page', filters.per_page.toString());
            if (filters?.page) queryParams.append('page', filters.page.toString());

            const response = await fetch(`${API_URL}/reviews?${queryParams.toString()}`, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            if (!response.ok) throw new Error('Failed to fetch reviews');

            const result: PaginatedResponse<Review> = await response.json();
            return result.data.data;
        } catch (error) {
            console.error('Error fetching reviews:', error);
            throw error;
        }
    }

    // Get single review
    async getReview(reviewId: number): Promise<Review> {
        try {
            const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
                method: 'GET',
                headers: this.getHeaders(true),
            });

            if (!response.ok) throw new Error('Failed to fetch review');

            const result: ApiResponse<Review> = await response.json();
            if (!result.success || !result.data) throw new Error(result.message);
            return result.data;
        } catch (error) {
            console.error('Error fetching review:', error);
            throw error;
        }
    }

    // ==================== USER METHODS ====================

    // Get current user's reviews
    async getMyReviews(): Promise<Review[]> {
        try {
            const response = await fetch(`${API_URL}/user/reviews`, {
                method: 'GET',
                headers: this.getHeaders(true),
            });

            if (!response.ok) throw new Error('Failed to fetch my reviews');

            const result: PaginatedResponse<Review> = await response.json();
            return result.data.data;
        } catch (error) {
            console.error('Error fetching my reviews:', error);
            throw error;
        }
    }

    // Create new review
    async createReview(data: {
        tourID: number;
        rating: number;
        comment: string;
        images?: string[];
    }): Promise<Review> {
        try {
            const response = await fetch(`${API_URL}/reviews`, {
                method: 'POST',
                headers: this.getHeaders(true),
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed to create review');

            const result: ApiResponse<Review> = await response.json();
            if (!result.success || !result.data) throw new Error(result.message);
            return result.data;
        } catch (error) {
            console.error('Error creating review:', error);
            throw error;
        }
    }

    // Update own review
    async updateReview(reviewId: number, data: {
        rating?: number;
        comment?: string;
        images?: string[];
    }): Promise<Review> {
        try {
            const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
                method: 'PUT',
                headers: this.getHeaders(true),
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed to update review');

            const result: ApiResponse<Review> = await response.json();
            if (!result.success || !result.data) throw new Error(result.message);
            return result.data;
        } catch (error) {
            console.error('Error updating review:', error);
            throw error;
        }
    }

    // Delete own review
    async deleteReview(reviewId: number): Promise<void> {
        try {
            const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
                method: 'DELETE',
                headers: this.getHeaders(true),
            });

            if (!response.ok) throw new Error('Failed to delete review');
        } catch (error) {
            console.error('Error deleting review:', error);
            throw error;
        }
    }

    // Upload images for review
    async uploadReviewImages(reviewId: number, images: File[]): Promise<string[]> {
        try {
            const formData = new FormData();
            images.forEach(image => formData.append('images[]', image));

            const token = this.getToken();
            const headers: Record<string, string> = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch(`${API_URL}/reviews/${reviewId}/images`, {
                method: 'POST',
                headers,
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to upload images');

            const result = await response.json();
            if (!result.success) throw new Error(result.message);
            return result.data.images;
        } catch (error) {
            console.error('Error uploading images:', error);
            throw error;
        }
    }

    // ==================== ADMIN METHODS ====================

    // Get all reviews (Admin)
    async adminGetAllReviews(filters?: ReviewFilters) {
        try {
            const queryParams = new URLSearchParams();

            if (filters?.status) queryParams.append('status', filters.status);
            if (filters?.tourID) queryParams.append('tourID', filters.tourID.toString());
            if (filters?.rating) queryParams.append('rating', filters.rating.toString());
            if (filters?.verified_only) queryParams.append('verified_only', 'true');
            if (filters?.search) queryParams.append('search', filters.search);
            if (filters?.sort_by) queryParams.append('sort_by', filters.sort_by);
            if (filters?.sort_order) queryParams.append('sort_order', filters.sort_order);
            if (filters?.per_page) queryParams.append('per_page', filters.per_page.toString());
            if (filters?.page) queryParams.append('page', filters.page.toString());

            const response = await fetch(`${API_URL}/admin/reviews?${queryParams.toString()}`, {
                method: 'GET',
                headers: this.getHeaders(true),
            });

            if (!response.ok) throw new Error('Failed to fetch reviews');

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error fetching reviews:', error);
            throw error;
        }
    }

    // Approve review (Admin)
    async approveReview(reviewId: number): Promise<Review> {
        try {
            const response = await fetch(`${API_URL}/admin/reviews/${reviewId}/approve`, {
                method: 'PATCH',
                headers: this.getHeaders(true),
            });

            if (!response.ok) throw new Error('Failed to approve review');

            const result: ApiResponse<Review> = await response.json();
            if (!result.success || !result.data) throw new Error(result.message);
            return result.data;
        } catch (error) {
            console.error('Error approving review:', error);
            throw error;
        }
    }

    // Hide review (Admin)
    async hideReview(reviewId: number): Promise<Review> {
        try {
            const response = await fetch(`${API_URL}/admin/reviews/${reviewId}/hide`, {
                method: 'PATCH',
                headers: this.getHeaders(true),
            });

            if (!response.ok) throw new Error('Failed to hide review');

            const result: ApiResponse<Review> = await response.json();
            if (!result.success || !result.data) throw new Error(result.message);
            return result.data;
        } catch (error) {
            console.error('Error hiding review:', error);
            throw error;
        }
    }

    // Delete review (Admin)
    async adminDeleteReview(reviewId: number): Promise<void> {
        try {
            const response = await fetch(`${API_URL}/admin/reviews/${reviewId}`, {
                method: 'DELETE',
                headers: this.getHeaders(true),
            });

            if (!response.ok) throw new Error('Failed to delete review');
        } catch (error) {
            console.error('Error deleting review:', error);
            throw error;
        }
    }

    // ==================== HELPER METHODS ====================

    calculateAverageRating(reviews: Review[]): number {
        if (!reviews || reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return Math.round((sum / reviews.length) * 10) / 10;
    }

    getRatingDistribution(reviews: Review[]): Record<number, number> {
        const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        reviews.forEach(review => {
            if (review.rating >= 1 && review.rating <= 5) {
                distribution[review.rating]++;
            }
        });
        return distribution;
    }

    // getVerifiedPurchaseCount(reviews: Review[]): number {
    //     return reviews.filter(review => review.is_verified_purchase).length;
    // }
}
export const reviewService = new ReviewService();