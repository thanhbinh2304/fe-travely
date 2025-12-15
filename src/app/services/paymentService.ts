import {
    ApiResponse,
    Payment,
    CreatePaymentData,
    UpdatePaymentData,
    RefundPaymentData,
    PaymentFilterParams,
    PaymentPaginationParams
} from "@/types/payment";

const API_URL = process.env.NEXT_PUBLIC_SERVER_API || 'http://127.0.0.1:8000/api';

interface MoMoPaymentResponse {
    checkoutID: number;
    payUrl: string;
    qrCodeUrl?: string;
    deeplink?: string;
    orderId: string;
}

interface VietQRPaymentResponse {
    checkoutID: number;
    qrImageUrl: string;
    accountNo: string;
    accountName: string;
    bankName: string;
    bankId: string;
    amount: number;
    description: string;
    orderId: string;
}

class PaymentService {
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

    // Get all payments (Admin)
    async index(params?: PaymentPaginationParams & PaymentFilterParams): Promise<ApiResponse<Payment[]>> {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.bookingID) queryParams.append('bookingID', params.bookingID);
        if (params?.paymentMethod) queryParams.append('paymentMethod', params.paymentMethod);
        if (params?.paymentStatus) queryParams.append('paymentStatus', params.paymentStatus);
        if (params?.startDate) queryParams.append('startDate', params.startDate);
        if (params?.endDate) queryParams.append('endDate', params.endDate);

        const response = await fetch(`${API_URL}/payments?${queryParams.toString()}`, {
            method: 'GET',
            headers: this.getHeaders(true),
        });

        const data = await response.json();
        if (!response.ok) {
            throw data;
        }
        return data;
    }

    // Get all payments for admin dashboard
    async adminGetAllPayments(
        params?: {
            payment_method?: string;
            payment_status?: string;
            from_date?: string;
            to_date?: string;
            search?: string;
            per_page?: number;
            page?: number;
        }
        ): Promise<ApiResponse<{ data: Payment[] }>> {
        const queryParams = new URLSearchParams();

        if (params?.payment_method) queryParams.append("payment_method", params.payment_method);
        if (params?.payment_status) queryParams.append("payment_status", params.payment_status);
        if (params?.from_date) queryParams.append("from_date", params.from_date);
        if (params?.to_date) queryParams.append("to_date", params.to_date);
        if (params?.search) queryParams.append("search", params.search);
        if (params?.per_page) queryParams.append("per_page", params.per_page.toString());
        if (params?.page) queryParams.append("page", params.page.toString());

        const response = await fetch(`${API_URL}/admin/payments?${queryParams.toString()}`, {
            method: "GET",
            headers: this.getHeaders(true),
        });

        const data = await response.json();
        if (!response.ok) throw data;
        return data; // => { success, data: { data: [...] } }
        }



    // Create a new payment
    async store(paymentData: CreatePaymentData): Promise<ApiResponse<Payment>> {
        const response = await fetch(`${API_URL}/payments`, {
            method: 'POST',
            headers: this.getHeaders(true),
            body: JSON.stringify(paymentData),
        });

        const data = await response.json();
        if (!response.ok) {
            throw data;
        }
        return data;
    }

    // Get payment details
    async show(checkoutID: string): Promise<ApiResponse<Payment>> {
        const response = await fetch(`${API_URL}/payments/${checkoutID}`, {
            method: 'GET',
            headers: this.getHeaders(true),
        });

        const data = await response.json();
        if (!response.ok) {
            throw data;
        }
        return data;
    }

    // Update payment
    async update(checkoutID: string, paymentData: UpdatePaymentData): Promise<ApiResponse<Payment>> {
        const response = await fetch(`${API_URL}/payments/${checkoutID}`, {
            method: 'PUT',
            headers: this.getHeaders(true),
            body: JSON.stringify(paymentData),
        });

        const data = await response.json();
        if (!response.ok) {
            throw data;
        }
        return data;
    }

    // Delete payment
    async destroy(checkoutID: string): Promise<ApiResponse<null>> {
        const response = await fetch(`${API_URL}/payments/${checkoutID}`, {
            method: 'DELETE',
            headers: this.getHeaders(true),
        });

        const data = await response.json();
        if (!response.ok) {
            throw data;
        }
        return data;
    }

    // Get payment by booking ID
    async getByBookingID(bookingID: string): Promise<ApiResponse<Payment>> {
        const response = await fetch(`${API_URL}/bookings/${bookingID}/payment`, {
            method: 'GET',
            headers: this.getHeaders(true),
        });

        const data = await response.json();
        if (!response.ok) {
            throw data;
        }
        return data;
    }

    // Update payment status
    async updateStatus(
        checkoutID: string,
        status: 'pending' | 'completed' | 'failed' | 'refunded' | 'partially_refunded'
    ): Promise<ApiResponse<Payment>> {
        const response = await fetch(`${API_URL}/payments/${checkoutID}/status`, {
            method: 'PATCH',
            headers: this.getHeaders(true),
            body: JSON.stringify({ paymentStatus: status }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw data;
        }
        return data;
    }

    // Process refund
    async refund(checkoutID: string, refundData: RefundPaymentData): Promise<ApiResponse<Payment>> {
        const response = await fetch(`${API_URL}/payments/${checkoutID}/refund`, {
            method: 'POST',
            headers: this.getHeaders(true),
            body: JSON.stringify(refundData),
        });

        const data = await response.json();
        if (!response.ok) {
            throw data;
        }
        return data;
    }

    // Verify payment with payment gateway
    async verify(checkoutID: string, transactionID: string): Promise<ApiResponse<Payment>> {
        const response = await fetch(`${API_URL}/payments/${checkoutID}/verify`, {
            method: 'POST',
            headers: this.getHeaders(true),
            body: JSON.stringify({ transactionID }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw data;
        }
        return data;
    }

    // Generate QR code for payment
    async generateQRCode(checkoutID: string): Promise<ApiResponse<{ qrCode: string }>> {
        const response = await fetch(`${API_URL}/payments/${checkoutID}/qrcode`, {
            method: 'POST',
            headers: this.getHeaders(true),
        });

        const data = await response.json();
        if (!response.ok) {
            throw data;
        }
        return data;
    }

    // Get payment statistics
    async getStatistics(params?: { startDate?: string; endDate?: string }): Promise<ApiResponse<{
        totalPayments: number;
        totalAmount: number;
        totalRefunded: number;
        completedPayments: number;
        pendingPayments: number;
        failedPayments: number;
        paymentsByMethod: Record<string, number>;
    }>> {
        const queryParams = new URLSearchParams();

        if (params?.startDate) queryParams.append('startDate', params.startDate);
        if (params?.endDate) queryParams.append('endDate', params.endDate);

        const response = await fetch(`${API_URL}/payments/statistics?${queryParams.toString()}`, {
            method: 'GET',
            headers: this.getHeaders(true),
        });

        const data = await response.json();
        if (!response.ok) {
            throw data;
        }
        return data;
    }

    // ==================== MOMO PAYMENT ====================

    // Create MoMo payment
    async createMoMoPayment(data: {
        bookingID: number;
        amount: number;
        orderInfo?: string;
    }): Promise<MoMoPaymentResponse> {
        try {
            const response = await fetch(`${API_URL}/payment/momo/create`, {
                method: 'POST',
                headers: this.getHeaders(true),
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed to create MoMo payment');

            const result = await response.json();
            if (!result.success) throw new Error(result.message);
            return result.data;
        } catch (error) {
            console.error('Error creating MoMo payment:', error);
            throw error;
        }
    }

    // MoMo callback handler (for frontend reference)
    async handleMoMoCallback(callbackData: Record<string, any>) {
        try {
            const response = await fetch(`${API_URL}/payment/momo/callback`, {
                method: 'POST',
                headers: this.getHeaders(false),
                body: JSON.stringify(callbackData),
            });

            if (!response.ok) throw new Error('Failed to process MoMo callback');

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error handling MoMo callback:', error);
            throw error;
        }
    }

    // MoMo return URL handler
    async getMoMoPaymentResult(orderId: string, resultCode: string) {
        try {
            const response = await fetch(`${API_URL}/payment/momo/return?orderId=${orderId}&resultCode=${resultCode}`, {
                method: 'GET',
                headers: this.getHeaders(false),
            });

            if (!response.ok) throw new Error('Failed to get payment result');

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error getting MoMo payment result:', error);
            throw error;
        }
    }

    // ==================== VIETQR PAYMENT ====================

    // Create VietQR payment
    async createVietQRPayment(data: {
        bookingID: number;
        amount: number;
        description?: string;
    }): Promise<VietQRPaymentResponse> {
        try {
            const response = await fetch(`${API_URL}/payment/vietqr/create`, {
                method: 'POST',
                headers: this.getHeaders(true),
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed to create VietQR payment');

            const result = await response.json();
            if (!result.success) throw new Error(result.message);
            return result.data;
        } catch (error) {
            console.error('Error creating VietQR payment:', error);
            throw error;
        }
    }

    // Verify VietQR payment (manual verification by admin)
    async verifyVietQRPayment(data: {
        checkoutID: number;
        transactionID?: string;
    }) {
        try {
            const response = await fetch(`${API_URL}/payment/vietqr/verify`, {
                method: 'POST',
                headers: this.getHeaders(true),
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed to verify VietQR payment');

            const result = await response.json();
            if (!result.success) throw new Error(result.message);
            return result.data;
        } catch (error) {
            console.error('Error verifying VietQR payment:', error);
            throw error;
        }
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

    getPaymentMethodName(method: string): string {
        const methodMap: Record<string, string> = {
            credit_card: 'Thẻ tín dụng',
            debit_card: 'Thẻ ghi nợ',
            bank_transfer: 'Chuyển khoản ngân hàng',
            e_wallet: 'Ví điện tử',
            cash: 'Tiền mặt',
            qr_code: 'QR Code',
        };
        return methodMap[method] || method;
    }

    getPaymentStatusColor(status: string): string {
        const colorMap: Record<string, string> = {
            pending: 'yellow',
            completed: 'green',
            failed: 'red',
            refunded: 'gray',
            partially_refunded: 'orange',
        };
        return colorMap[status] || 'gray';
    }

    getPaymentStatusName(status: string): string {
        const statusMap: Record<string, string> = {
            pending: 'Chờ thanh toán',
            completed: 'Đã thanh toán',
            failed: 'Thất bại',
            refunded: 'Đã hoàn tiền',
            partially_refunded: 'Hoàn tiền một phần',
        };
        return statusMap[status] || status;
    }

    isRefundable(payment: Payment): boolean {
        if (payment.paymentStatus !== 'completed') {
            return false;
        }
        // Check if payment is within refund period (e.g., 30 days)
        if (payment.paymentDate) {
            const paymentDate = new Date(payment.paymentDate);
            const now = new Date();
            const diffDays = (now.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24);
            return diffDays <= 30;
        }
        return true;
    }

    calculateRefundableAmount(payment: Payment): number {
        if (!payment.refundAmount) {
            return payment.amount;
        }
        return payment.amount - payment.refundAmount;
    }

    validatePaymentData(data: CreatePaymentData): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!data.bookingID) {
            errors.push('Booking ID is required');
        }
        if (!data.paymentMethod) {
            errors.push('Payment method is required');
        }
        if (!data.amount || data.amount <= 0) {
            errors.push('Amount must be greater than 0');
        }

        return {
            valid: errors.length === 0,
            errors,
        };
    }

    // Alias method for consistency with component usage (uses admin route)
    async getPaymentDetails(checkoutID: number): Promise<ApiResponse<Payment>> {
        const response = await fetch(`${API_URL}/admin/payments/${checkoutID}`, {
            method: 'GET',
            headers: this.getHeaders(true),
        });

        const data = await response.json();
        if (!response.ok) {
            throw data;
        }
        return data;
    }

    // Delete payment (Admin route)
    async adminDeletePayment(checkoutID: number): Promise<ApiResponse<null>> {
        const response = await fetch(`${API_URL}/admin/payments/${checkoutID}`, {
            method: 'DELETE',
            headers: this.getHeaders(true),
        });

        const data: ApiResponse<null> = await response.json();

        if (!response.ok) {
            throw data;
        }

        return data;
    }
}

export const paymentService = new PaymentService();
