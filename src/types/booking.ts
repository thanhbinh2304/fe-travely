export interface Booking {
    bookingID: number;
    tourID: number;
    userID: string;
    bookingDate: string;
    numAdults: number;
    numChildren: number;
    totalPrice: number;
    paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
    bookingStatus: 'confirmed' | 'cancelled' | 'completed';
    specialRequests?: string;
    // Relations
    user?: {
        userID: string;
        userName: string;
        email: string;
        phoneNumber?: string;
    };
    tour?: {
        tourID: number;
        title: string;
        destination: string;
        priceAdult: number;
        priceChild: number;
        images?: Array<{ imageURL: string }>;
    };
    checkout?: {
        checkoutID: number;
        paymentMethod: string;
        amount: number;
        paymentStatus: string;
        paymentDate?: string;
    };
    invoice?: {
        invoiceID: number;
        amount: number;
        dateIssued: string;
        details?: any;
    };
}

export interface CreateBookingData {
    tourID: number;
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
    paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
}

export interface BookingFilterParams {
    userID?: string;
    tourID?: number;
    paymentStatus?: 'pending' | 'paid' | 'refunded' | 'failed';
    bookingStatus?: 'confirmed' | 'cancelled' | 'completed';
    start_date?: string;
    end_date?: string;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}

export interface BookingPaginationParams {
    page?: number;
    per_page?: number;
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