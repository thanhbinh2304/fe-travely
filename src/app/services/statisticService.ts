import { ApiResponse } from "@/types/booking";

const API_URL = process.env.NEXT_PUBLIC_SERVER_API || 'http://127.0.0.1:8000/api';

interface DashboardStats {
    total_users: number;
    total_tours: number;
    total_bookings: number;
    total_revenue: number;
    bookings_this_month: number;
    revenue_this_month: number;
    pending_bookings: number;
    confirmed_bookings: number;
}

interface BookingStats {
    total_bookings: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    total_revenue: number;
    average_booking_value: number;
}

interface RevenueStats {
    total_revenue: number;
    revenue_by_period: Array<{
        period: string;
        revenue: number;
    }>;
    revenue_by_tour: Array<{
        tourID: number;
        tourName: string;
        revenue: number;
        bookings: number;
    }>;
}

interface PaymentMethodStats {
    method: string;
    count: number;
    total_amount: number;
    percentage: number;
}

interface TopTour {
    tourID: number;
    title: string;
    destination: string;
    total_bookings: number;
    total_revenue: number;
    average_rating?: number;
}

class StatisticService {
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

    // Get dashboard overview statistics
    async getDashboardOverview(): Promise<ApiResponse<DashboardStats>> {
        const response = await fetch(`${API_URL}/admin/statistics/dashboard`, {
            method: 'GET',
            headers: this.getHeaders(true),
        });

        const data = await response.json();
        if (!response.ok) {
            throw data;
        }
        return data;
    }

    // Get booking statistics
    async getBookingStats(params?: {
        start_date?: string;
        end_date?: string;
    }): Promise<ApiResponse<BookingStats>> {
        const queryParams = new URLSearchParams();
        if (params?.start_date) queryParams.append('start_date', params.start_date);
        if (params?.end_date) queryParams.append('end_date', params.end_date);

        const response = await fetch(`${API_URL}/admin/statistics/bookings?${queryParams.toString()}`, {
            method: 'GET',
            headers: this.getHeaders(true),
        });

        const data = await response.json();
        if (!response.ok) {
            throw data;
        }
        return data;
    }

    // Get revenue statistics
    async getRevenueStats(params?: {
        period?: 'day' | 'week' | 'month' | 'year';
        start_date?: string;
        end_date?: string;
    }): Promise<ApiResponse<RevenueStats>> {
        const queryParams = new URLSearchParams();
        if (params?.period) queryParams.append('period', params.period);
        if (params?.start_date) queryParams.append('start_date', params.start_date);
        if (params?.end_date) queryParams.append('end_date', params.end_date);

        const response = await fetch(`${API_URL}/admin/statistics/revenue?${queryParams.toString()}`, {
            method: 'GET',
            headers: this.getHeaders(true),
        });

        const data = await response.json();
        if (!response.ok) {
            throw data;
        }
        return data;
    }

    // Get payment method statistics
    async getPaymentMethodStats(): Promise<ApiResponse<PaymentMethodStats[]>> {
        const response = await fetch(`${API_URL}/admin/statistics/payment-methods`, {
            method: 'GET',
            headers: this.getHeaders(true),
        });

        const data = await response.json();
        if (!response.ok) {
            throw data;
        }
        return data;
    }

    // Get top tours
    async getTopTours(params?: {
        limit?: number;
        period?: 'week' | 'month' | 'year' | 'all';
    }): Promise<ApiResponse<TopTour[]>> {
        const queryParams = new URLSearchParams();
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.period) queryParams.append('period', params.period);

        const response = await fetch(`${API_URL}/admin/statistics/top-tours?${queryParams.toString()}`, {
            method: 'GET',
            headers: this.getHeaders(true),
        });

        const data = await response.json();
        if (!response.ok) {
            throw data;
        }
        return data;
    }
}

export const statisticService = new StatisticService();
