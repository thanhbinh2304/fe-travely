export interface Booking {
    bookingID: string;
    tourID: string;
    userID: string;
    bookingDate: string;
    numAdults: number;
    numChildren: number;
    totalPrice: number;
    paymentStatus: 'pending' | 'completed' | 'failed';
    bookingStatus: 'confirmed' | 'cancelled' | 'completed';
    specialRequests?: string;
    createdAt?: string;
    updatedAt?: string;
    // Relations
    tourTitle?: string;
    tourDestination?: string;
    userName?: string;
    userEmail?: string;
    userPhone?: string;
}

export interface CreateBookingData {
    tourID: string;
    userID: string;
    bookingDate: string;
    numAdults: number;
    numChildren: number;
    totalPrice: number;
    specialRequests?: string;
}

export interface UpdateBookingData {
    bookingDate?: string;
    numAdults?: number;
    numChildren?: number;
    totalPrice?: number;
    specialRequests?: string;
}

export interface UpdateBookingStatusData {
    bookingStatus: 'confirmed' | 'cancelled' | 'completed';
}

export interface UpdatePaymentStatusData {
    paymentStatus: 'pending' | 'completed' | 'failed';
}

export interface BookingFilterParams {
    userID?: string;
    tourID?: string;
    paymentStatus?: 'pending' | 'completed' | 'failed';
    bookingStatus?: 'confirmed' | 'cancelled' | 'completed';
    startDate?: string;
    endDate?: string;
}

export interface BookingPaginationParams {
    page?: number;
    limit?: number;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    success?: boolean;
    meta?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}