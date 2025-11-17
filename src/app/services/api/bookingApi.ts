import { API_BASE_URL } from "../../config/api";

const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('authToken');
    }
    return null;
};

const getHeaders = (includeAuth = true): HeadersInit => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (includeAuth) {
        const token = getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    return headers;
};

export const bookingApi = {
    // Lấy tất cả bookings (Admin: tất cả, User: của mình)
    getAllBookings: async () => {
        const response = await fetch(`${API_BASE_URL}/bookings`, {
            method: 'GET',
            headers: getHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch bookings');
        }

        return await response.json();
    },

    // Lấy booking theo ID
    getBookingById: async (id: string | number) => {
        const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
            method: 'GET',
            headers: getHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch booking');
        }

        return await response.json();
    },

    // Tạo booking mới
    createBooking: async (bookingData: any) => {
        const response = await fetch(`${API_BASE_URL}/bookings`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(bookingData),
        });

        if (!response.ok) {
            throw new Error('Failed to create booking');
        }

        return await response.json();
    },

    // Cập nhật booking
    updateBooking: async (id: string | number, bookingData: any) => {
        const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(bookingData),
        });

        if (!response.ok) {
            throw new Error('Failed to update booking');
        }

        return await response.json();
    },

    // Hủy booking
    cancelBooking: async (id: string | number) => {
        const response = await fetch(`${API_BASE_URL}/bookings/${id}/cancel`, {
            method: 'PUT',
            headers: getHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to cancel booking');
        }

        return await response.json();
    },

    // Xóa booking (Admin only)
    deleteBooking: async (id: string | number) => {
        const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to delete booking');
        }

        return await response.json();
    },

    // Lấy bookings của user hiện tại
    getMyBookings: async () => {
        const response = await fetch(`${API_BASE_URL}/bookings/my-bookings`, {
            method: 'GET',
            headers: getHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user bookings');
        }

        return await response.json();
    },
};
