import { Review } from "@/types/review";
const API_URL = process.env.SERVER_API || 'http://localhost:8000/api';

class ReviewService{
    private getHeaders(includeAuth = false) {
        const headers: Record <string, string> = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
        if (includeAuth){
            const token = localStorage.getItem('access_token');
            if(token){
                headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return headers;
    }
    calculateAverageRating(reviews: Review[]): number {
        if (!reviews || reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return Math.round((sum / reviews.length) * 10) / 10;
    }
}
export const reviewService = new ReviewService();