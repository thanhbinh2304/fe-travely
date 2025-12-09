
import { User, UserCreateData, UserUpdateData } from "@/types/user";
// import { getServerToken } from "@/utils/serverToken";
const API_URL = process.env.NEXT_PUBLIC_SERVER_API || 'http://localhost:8000/api';

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
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        next_page_url: string | null;
        path: string;
        per_page: number;
        prev_page_url: string | null;
        to: number;
        total: number;
    };
}

interface UserStats {
    total_bookings: number;
    pending_bookings: number;
    confirmed_bookings: number;
    cancelled_bookings: number;
    total_spent: number;

}

export interface UserDetailResponse {
    details: {
        userID: string;
        userName: string;
        email: string;
        phoneNumber?: string;
        address?: string;
        role_id: number;
        status: 'active' | 'inactive' | 'banned';
        verified: boolean;
        created_at: string;
        updated_at: string;
    };
    roleName: string;
    lastLogin?: string;
    stats: UserStats;
}

interface UserFilters {
    role_id?: number;
    search?: string;
    is_active?: boolean;
    start_date?: string;
    end_date?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
}

class UserService {
    private getHeaders(includeAuth = true) {
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

    // ==================== ADMIN METHODS ====================

    /**
     * Get all users with filters and pagination (Admin only)
     */
    async getAllUsers(filters?: UserFilters): Promise<User[]> {
        try {
            const queryParams = new URLSearchParams();

            if (filters?.role_id) queryParams.append('role_id', filters.role_id.toString());
            if (filters?.search) queryParams.append('search', filters.search);
            if (filters?.is_active !== undefined) queryParams.append('is_active', filters.is_active.toString());
            if (filters?.start_date) queryParams.append('start_date', filters.start_date);
            if (filters?.end_date) queryParams.append('end_date', filters.end_date);
            if (filters?.sort_by) queryParams.append('sort_by', filters.sort_by);
            if (filters?.sort_order) queryParams.append('sort_order', filters.sort_order);
            if (filters?.per_page) queryParams.append('per_page', filters.per_page.toString());
            if (filters?.page) queryParams.append('page', filters.page.toString());

            const url = `${API_URL}/admin/users${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(true),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const result: PaginatedResponse<User> = await response.json();

            if (!result.success) {
                throw new Error(result.data?.toString() || 'Failed to fetch users');
            }

            return result.data.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    /**
     * Get user by ID with full details and stats (Admin only)
     */
    async getUserById(userId: string): Promise<UserDetailResponse> {
        try {
            const response = await fetch(`${API_URL}/admin/users/${userId}`, {
                method: 'GET',
                headers: this.getHeaders(true),
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch user with ID ${userId}`);
            }

            const result: ApiResponse<UserDetailResponse> = await response.json();

            if (!result.success || !result.data) {
                throw new Error(result.message || 'Failed to fetch user details');
            }

            return result.data;
        } catch (error) {
            console.error('Error fetching user details:', error);
            throw error;
        }
    }

    /**
     * Get user's booking history (Admin only)
     */
    async getUserBookings(userId: string, filters?: {
        status?: string;
        start_date?: string;
        end_date?: string;
        per_page?: number;
        page?: number;
    }) {
        try {
            const queryParams = new URLSearchParams();

            if (filters?.status) queryParams.append('status', filters.status);
            if (filters?.start_date) queryParams.append('start_date', filters.start_date);
            if (filters?.end_date) queryParams.append('end_date', filters.end_date);
            if (filters?.per_page) queryParams.append('per_page', filters.per_page.toString());
            if (filters?.page) queryParams.append('page', filters.page.toString());

            const url = `${API_URL}/users/${userId}/bookings${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user bookings');
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Failed to fetch user bookings');
            }

            return result.data;
        } catch (error) {
            console.error('Error fetching user bookings:', error);
            throw error;
        }
    }

    /**
     * Toggle user account status (lock/unlock) (Admin only)
     */
    async toggleAccountStatus(userId: string): Promise<User> {
        try {
            const response = await fetch(`${API_URL}/admin/users/${userId}/toggle-status`, {
                method: 'PATCH',
                headers: this.getHeaders(true),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const result: ApiResponse<User> = await response.json();

            if (!result.success || !result.data) {
                throw new Error(result.message || 'Failed to toggle account status');
            }

            return result.data;
        } catch (error) {
            console.error('Error toggling account status:', error);
            throw error;
        }
    }

    /**
     * Delete user (Admin only)
     */
    async deleteUser(userId: string): Promise<void> {
        try {
            const response = await fetch(`${API_URL}/admin/users/${userId}`, {
                method: 'DELETE',
                headers: this.getHeaders(true),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const result: ApiResponse<null> = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }

    // ==================== USER METHODS ====================

    /**
     * Update current user profile
     */
    async updateProfile(data: Partial<UserUpdateData>, avatar?: File): Promise<User> {
        try {
            const formData = new FormData();

            Object.keys(data).forEach(key => {
                const value = data[key as keyof UserUpdateData];
                if (value !== undefined && value !== null) {
                    formData.append(key, value.toString());
                }
            });

            if (avatar) {
                formData.append('avatar', avatar);
            }

            const token = this.getToken();
            const headers: Record<string, string> = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_URL}/user/profile`, {
                method: 'POST',
                headers,
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            const result: ApiResponse<User> = await response.json();

            if (!result.success || !result.data) {
                throw new Error(result.message || 'Failed to update profile');
            }

            return result.data;
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    }

    /**
     * Change current user password
     */
    async changePassword(currentPassword: string, newPassword: string, newPasswordConfirmation: string): Promise<{ access_token: string }> {
        try {
            const response = await fetch(`${API_URL}/user/change-password`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword,
                    new_password_confirmation: newPasswordConfirmation,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to change password');
            }

            const result: ApiResponse<{ access_token: string }> = await response.json();

            if (!result.success || !result.data) {
                throw new Error(result.message || 'Failed to change password');
            }

            // Update token in storage
            if (result.data.access_token) {
                localStorage.setItem('access_token', result.data.access_token);
                this.setCookie('access_token', result.data.access_token);
            }

            return result.data;
        } catch (error) {
            console.error('Error changing password:', error);
            throw error;
        }
    }

    private setCookie(name: string, value: string, days = 7): void {
        if (typeof document === 'undefined') return;
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
    }

    /**
     * Get current user's activity history
     */
    async getActivityHistory(filters?: {
        action?: string;
        start_date?: string;
        end_date?: string;
        sort_by?: string;
        sort_order?: 'asc' | 'desc';
        per_page?: number;
        page?: number;
    }) {
        try {
            const queryParams = new URLSearchParams();

            if (filters?.action) queryParams.append('action', filters.action);
            if (filters?.start_date) queryParams.append('start_date', filters.start_date);
            if (filters?.end_date) queryParams.append('end_date', filters.end_date);
            if (filters?.sort_by) queryParams.append('sort_by', filters.sort_by);
            if (filters?.sort_order) queryParams.append('sort_order', filters.sort_order);
            if (filters?.per_page) queryParams.append('per_page', filters.per_page.toString());
            if (filters?.page) queryParams.append('page', filters.page.toString());

            const url = `${API_URL}/user/activity-history${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch activity history');
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Failed to fetch activity history');
            }

            return result.data;
        } catch (error) {
            console.error('Error fetching activity history:', error);
            throw error;
        }
    }
}

export const userService = new UserService();
export default userService;
