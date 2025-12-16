export interface Payment {
    checkoutID: string;
    bookingID: string;
    paymentMethod: 'credit_card' | 'debit_card' | 'bank_transfer' | 'e_wallet' | 'cash' | 'qr_code';
    paymentDate?: string;
    refundDate?: string;
    refundAmount?: number;
    refundReason?: string;
    refundBy?: string;
    amount: number;
    paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded' | 'partially_refunded';
    transactionID?: string;
    paymentData?: string; // JSON string chứa thông tin từ cổng thanh toán
    qrCode?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreatePaymentData {
    bookingID: string;
    paymentMethod: 'credit_card' | 'debit_card' | 'bank_transfer' | 'e_wallet' | 'cash' | 'qr_code';
    amount: number;
    transactionID?: string;
    paymentData?: string;
}

export interface UpdatePaymentData {
    paymentMethod?: 'credit_card' | 'debit_card' | 'bank_transfer' | 'e_wallet' | 'cash' | 'qr_code';
    amount?: number;
    paymentStatus?: 'pending' | 'completed' | 'failed' | 'refunded' | 'partially_refunded';
    transactionID?: string;
    paymentData?: string;
}

export interface RefundPaymentData {
    refundAmount: number;
    refundReason: string;
    refundBy: string;
}

export interface PaymentFilterParams {
    bookingID?: string;
    paymentMethod?: string;
    paymentStatus?: 'pending' | 'completed' | 'failed' | 'refunded' | 'partially_refunded';
    startDate?: string;
    endDate?: string;
}

export interface PaymentPaginationParams {
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
