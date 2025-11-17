import { API_BASE_URL } from "../../config/api";

// Helper function để lấy token
const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('authToken');
    }
    return null;
};

// Helper function để tạo headers
const getHeaders = (includeAuth = false): HeadersInit => {
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

// Helper function cho FormData (không set Content-Type)
const getFormDataHeaders = (): HeadersInit => {
    const headers: HeadersInit = {};
    const token = getAuthToken();

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

export const tourApi = {
    // Lấy tất cả tours (Public)
    getAllTours: async () => {
        const response = await fetch(`${API_BASE_URL}/tours`, {
            method: 'GET',
            headers: getHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch tours');
        }

        return await response.json();
    },

    // Lấy tour theo ID (Public)
    getTourById: async (id: string | number) => {
        const response = await fetch(`${API_BASE_URL}/tours/${id}`, {
            method: 'GET',
            headers: getHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch tour');
        }

        return await response.json();
    },

    // Tạo tour mới (Admin only)
    createTour: async (tourData: FormData) => {
        const response = await fetch(`${API_BASE_URL}/tours`, {
            method: 'POST',
            headers: getFormDataHeaders(),
            body: tourData,
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                throw new Error('Unauthorized: Admin access required');
            }
            throw new Error('Failed to create tour');
        }

        return await response.json();
    },

    // Cập nhật tour (Admin only)
    updateTour: async (id: string | number, tourData: FormData) => {
        const response = await fetch(`${API_BASE_URL}/tours/${id}`, {
            method: 'POST',
            headers: getFormDataHeaders(),
            body: tourData,
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                throw new Error('Unauthorized: Admin access required');
            }
            throw new Error('Failed to update tour');
        }

        return await response.json();
    },

    // Xóa tour (Admin only)
    deleteTour: async (id: string | number) => {
        const response = await fetch(`${API_BASE_URL}/tours/${id}`, {
            method: 'DELETE',
            headers: getHeaders(true),
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                throw new Error('Unauthorized: Admin access required');
            }
            throw new Error('Failed to delete tour');
        }

        return await response.json();
    },

    // Lấy tours nổi bật (Public)
    getFeaturedTours: async () => {
        const response = await fetch(`${API_BASE_URL}/tours/featured`, {
            method: 'GET',
            headers: getHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch featured tours');
        }

        return await response.json();
    },

    // Tìm kiếm tours (Public)
    searchTours: async (keyword: string) => {
        const response = await fetch(
            `${API_BASE_URL}/tours/search?keyword=${encodeURIComponent(keyword)}`,
            {
                method: 'GET',
                headers: getHeaders(),
            }
        );

        if (!response.ok) {
            throw new Error('Failed to search tours');
        }

        return await response.json();
    },

    // Lấy tours có sẵn (Public)
    getAvailableTours: async () => {
        const response = await fetch(`${API_BASE_URL}/tours/available`, {
            method: 'GET',
            headers: getHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch available tours');
        }

        return await response.json();
    },

    // Lấy tours theo điểm đến (Public)
    getToursByDestination: async (destination: string) => {
        const response = await fetch(
            `${API_BASE_URL}/tours/destination/${encodeURIComponent(destination)}`,
            {
                method: 'GET',
                headers: getHeaders(),
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch tours by destination');
        }

        return await response.json();
    },

    // Cập nhật trạng thái availability (Admin only)
    updateAvailability: async (id: string | number, availability: boolean) => {
        const response = await fetch(`${API_BASE_URL}/tours/${id}/availability`, {
            method: 'PUT',
            headers: getHeaders(true),
            body: JSON.stringify({ availability }),
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                throw new Error('Unauthorized: Admin access required');
            }
            throw new Error('Failed to update availability');
        }

        return await response.json();
    },

    // Cập nhật số lượng (Admin only)
    updateQuantity: async (id: string | number, quantity: number) => {
        const response = await fetch(`${API_BASE_URL}/tours/${id}/quantity`, {
            method: 'PUT',
            headers: getHeaders(true),
            body: JSON.stringify({ quantity }),
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                throw new Error('Unauthorized: Admin access required');
            }
            throw new Error('Failed to update quantity');
        }

        return await response.json();
    },
};
