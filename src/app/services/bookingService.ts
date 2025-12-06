import {
    ApiResponse,
    Booking,
    CreateBookingData,
    UpdateBookingData,
    UpdateBookingStatusData,
    UpdatePaymentStatusData,
    BookingFilterParams,
    BookingPaginationParams
} from "@/types/booking";

const API_URL = process.env.SERVER_API || 'http://localhost:8000/api';

class BookingService {
    private getHeaders(includeAuth = false) {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
        if (includeAuth) {
            const token = localStorage.getItem('access_token');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return headers;
    }

    // Get all bookings (Admin)
    async index(params?: BookingPaginationParams & BookingFilterParams): Promise<ApiResponse<Booking[]>> {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.userID) queryParams.append('userID', params.userID);
        if (params?.tourID) queryParams.append('tourID', params.tourID);
        if (params?.paymentStatus) queryParams.append('paymentStatus', params.paymentStatus);
        if (params?.bookingStatus) queryParams.append('bookingStatus', params.bookingStatus);
        if (params?.startDate) queryParams.append('startDate', params.startDate);
        if (params?.endDate) queryParams.append('endDate', params.endDate);

        const response = await fetch(`${API_URL}/bookings?${queryParams.toString()}`, {
            method: 'GET',
            headers: this.getHeaders(true),
        });

        const data = await response.json();
        if (!response.ok) {
            throw data;
        }
        return data;
    }

    // Create a new booking
    async store(bookingData: CreateBookingData): Promise<ApiResponse<Booking>> {
        const response = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: this.getHeaders(true),
            body: JSON.stringify(bookingData),
        });

        const data = await response.json();
        if (!response.ok) {
            throw data;
        }
        return data;
    }

    // Get booking details
    async show(bookingID: string): Promise<ApiResponse<Booking>> {
        const response = await fetch(`${API_URL}/bookings/${bookingID}`, {
            method: 'GET',
            headers: this.getHeaders(true),
        });

        const data = await response.json();
        if (!response.ok) {
            throw data;
        }
        return data;
    }

    // Update booking
    async update(bookingID: string, bookingData: UpdateBookingData): Promise<ApiResponse<Booking>> {
        const response = await fetch(`${API_URL}/bookings/${bookingID}`, {
            method: 'PUT',
            headers: this.getHeaders(true),
            body: JSON.stringify(bookingData),
        });

        const data = await response.json();
        if (!response.ok) {
            throw data;
        }
        return data;
    }

    // Delete booking
    async destroy(bookingID: string): Promise<ApiResponse<null>> {
        const response = await fetch(`${API_URL}/bookings/${bookingID}`, {
            method: 'DELETE',
            headers: this.getHeaders(true),
        });

        const data = await response.json();
        if (!response.ok) {
            throw data;
        }
        return data;
    }

    // Get user's bookings
    async getUserBookings(userID: string, params?: BookingPaginationParams): Promise<ApiResponse<Booking[]>> {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());

        const response = await fetch(`${API_URL}/users/${userID}/bookings?${queryParams.toString()}`, {
            method: 'GET',
            headers: this.getHeaders(true),
        });

        const data = await response.json();
        if (!response.ok) {
            throw data;
        }
        return data;
    }

    // Get tour's bookings
    async getTourBookings(tourID: string, params?: BookingPaginationParams): Promise<ApiResponse<Booking[]>> {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());

        const response = await fetch(`${API_URL}/tours/${tourID}/bookings?${queryParams.toString()}`, {
            method: 'GET',
            headers: this.getHeaders(true),
        });

        const data = await response.json();
        if (!response.ok) {
            throw data;
        }
        return data;
    }

    // Update booking status
    async updateBookingStatus(bookingID: string, statusData: UpdateBookingStatusData): Promise<ApiResponse<Booking>> {
        const response = await fetch(`${API_URL}/bookings/${bookingID}/status`, {
            method: 'PATCH',
            headers: this.getHeaders(true),
            body: JSON.stringify(statusData),
        });

        const data = await response.json();
        if (!response.ok) {
            throw data;
        }
        return data;
    }

    // Update payment status
    async updatePaymentStatus(bookingID: string, statusData: UpdatePaymentStatusData): Promise<ApiResponse<Booking>> {
        const response = await fetch(`${API_URL}/bookings/${bookingID}/payment`, {
            method: 'PATCH',
            headers: this.getHeaders(true),
            body: JSON.stringify(statusData),
        });

        const data = await response.json();
        if (!response.ok) {
            throw data;
        }
        return data;
    }

    // Cancel booking
    async cancel(bookingID: string): Promise<ApiResponse<Booking>> {
        return this.updateBookingStatus(bookingID, { bookingStatus: 'cancelled' });
    }

    // Confirm booking
    async confirm(bookingID: string): Promise<ApiResponse<Booking>> {
        return this.updateBookingStatus(bookingID, { bookingStatus: 'confirmed' });
    }

    // Complete booking
    async complete(bookingID: string): Promise<ApiResponse<Booking>> {
        return this.updateBookingStatus(bookingID, { bookingStatus: 'completed' });
    }

    // Confirm payment
    async confirmPayment(bookingID: string): Promise<ApiResponse<Booking>> {
        return this.updatePaymentStatus(bookingID, { paymentStatus: 'completed' });
    }

    // Get booking statistics
    async getStatistics(params?: { startDate?: string; endDate?: string }): Promise<ApiResponse<{
        totalBookings: number;
        totalRevenue: number;
        pendingPayments: number;
        confirmedBookings: number;
        cancelledBookings: number;
        completedBookings: number;
    }>> {
        const queryParams = new URLSearchParams();

        if (params?.startDate) queryParams.append('startDate', params.startDate);
        if (params?.endDate) queryParams.append('endDate', params.endDate);

        const response = await fetch(`${API_URL}/bookings/statistics?${queryParams.toString()}`, {
            method: 'GET',
            headers: this.getHeaders(true),
        });

        const data = await response.json();
        if (!response.ok) {
            throw data;
        }
        return data;
    }

    // Helper methods
    formatPrice(price: number, currency: string = 'VND'): string {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: currency,
        }).format(price);
    }

    formatDate(dateString: string): string {
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(new Date(dateString));
    }

    formatDateTime(dateString: string): string {
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(dateString));
    }

    calculateTotalPrice(numAdults: number, numChildren: number, priceAdult: number, priceChild: number): number {
        return (numAdults * priceAdult) + (numChildren * priceChild);
    }

    getTotalGuests(booking: Booking): number {
        return booking.numAdults + booking.numChildren;
    }

    isBookingCancellable(booking: Booking): boolean {
        if (booking.bookingStatus === 'cancelled' || booking.bookingStatus === 'completed') {
            return false;
        }
        // Check if booking date is at least 24 hours away
        const bookingDate = new Date(booking.bookingDate);
        const now = new Date();
        const diffHours = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        return diffHours >= 24;
    }

    getBookingStatusColor(status: 'confirmed' | 'cancelled' | 'completed'): string {
        const colorMap = {
            confirmed: 'blue',
            cancelled: 'gray',
            completed: 'green',
        };
        return colorMap[status];
    }

    getPaymentStatusColor(status: 'pending' | 'completed' | 'failed'): string {
        const colorMap = {
            pending: 'yellow',
            completed: 'green',
            failed: 'red',
        };
        return colorMap[status];
    }
}

export const bookingService = new BookingService();
