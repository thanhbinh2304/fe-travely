import { API_BASE_URL } from "../../config/api";

interface LoginCredentials {
    email: string;
    password: string;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
}

interface AuthResponse {
    token: string;
    user: User;
}

export const authApi = {
    // Đăng nhập
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            throw new Error('Invalid credentials');
        }

        const data = await response.json();

        // Lưu token và user vào localStorage
        if (data.token) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }

        return data;
    },

    // Đăng ký
    register: async (userData: RegisterData): Promise<AuthResponse> => {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        const data = await response.json();

        // Lưu token và user vào localStorage
        if (data.token) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }

        return data;
    },

    // Đăng xuất
    logout: async (): Promise<void> => {
        const token = localStorage.getItem('authToken');

        if (token) {
            try {
                await fetch(`${API_BASE_URL}/logout`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
            } catch (error) {
                console.error('Error during logout:', error);
            }
        }

        // Xóa token và user khỏi localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    },

    // Lấy thông tin user hiện tại từ localStorage
    getCurrentUser: (): User | null => {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    return JSON.parse(userStr);
                } catch {
                    return null;
                }
            }
        }
        return null;
    },

    // Kiểm tra xem user có phải admin không
    isAdmin: (): boolean => {
        const user = authApi.getCurrentUser();
        return user?.role === 'admin';
    },

    // Kiểm tra xem user đã đăng nhập chưa
    isAuthenticated: (): boolean => {
        if (typeof window !== 'undefined') {
            return !!localStorage.getItem('authToken');
        }
        return false;
    },

    // Lấy token
    getToken: (): string | null => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('authToken');
        }
        return null;
    },

    // Lấy thông tin user từ server
    getProfile: async (): Promise<User> => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('No token found');
        }

        const response = await fetch(`${API_BASE_URL}/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch profile');
        }

        const user = await response.json();
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    },
};

// Export types
export type { LoginCredentials, RegisterData, User, AuthResponse };
