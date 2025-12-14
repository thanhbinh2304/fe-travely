import { StringToBoolean } from "class-variance-authority/types";
import { API_BASE_URL } from "../config/api";
import { User, LoginCredentials, RegisterData, AuthResponse, GoogleLoginData, FacebookLoginData } from "../../types/auth";
const API_URL = process.env.NEXT_PUBLIC_SERVER_API || 'http://127.0.0.1:8000/api';

class authService {
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

    // get token from localStorage and cookie
    getToken(): string | null {
        if (typeof window === 'undefined') return null;
        // Ưu tiên lấy từ cookie, fallback về localStorage
        const cookieToken = this.getCookie('access_token');
        if (cookieToken) return cookieToken;
        return localStorage.getItem('access_token');
    }

    // Helper để lấy cookie
    private getCookie(name: string): string | null {
        if (typeof document === 'undefined') return null;
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
        return null;
    }

    // Helper để set cookie
    private setCookie(name: string, value: string, days = 7): void {
        if (typeof document === 'undefined') return;
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
    }

    // Helper để xóa cookie
    private deleteCookie(name: string): void {
        if (typeof document === 'undefined') return;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }

    //save token to localStorage và cookie
    saveToken(token: string): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem('access_token', token);
        this.setCookie('access_token', token, 7); // Lưu 7 ngày
    }

    //save refresh token to localStorage
    saveRefreshToken(refreshToken: string): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem('refresh_token', refreshToken);
    }

    //get refresh token from localStorage
    getRefreshToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('refresh_token');
    }

    //remove token from localStorage và cookie
    removeToken(): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        this.deleteCookie('access_token');
    }

    //save user to localStorage
    saveUser(user: User): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem('user', JSON.stringify(user));
    }
    //get user from localStorage
    getUser(): User | null {
        if (typeof window === 'undefined') return null;
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }


    //Login
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        console.log('Login request to:', `${API_URL}/login`);
        console.log('Login credentials:', credentials);

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(credentials),
                mode: 'cors',
                // Bỏ credentials: 'include' vì backend dùng wildcard CORS
            });

            console.log('Login response status:', response.status);
            console.log('Login response headers:', Object.fromEntries(response.headers.entries()));

            // Check if response has content
            const contentType = response.headers.get('content-type');
            console.log('Content-Type:', contentType);

            const responseText = await response.text();
            console.log('Raw response text:', responseText);

            let data;
            try {
                data = responseText ? JSON.parse(responseText) : {};
            } catch (parseError) {
                console.error('Failed to parse JSON:', parseError);
                throw {
                    success: false,
                    msg: 'Invalid response from server. Response: ' + responseText.substring(0, 200)
                };
            }

            console.log('Parsed response data:', data);

            if (!response.ok) {
                console.error('Login failed with status:', response.status, 'data:', data);
                throw data;
            }

            //save token, refresh token and user
            this.saveToken(data.data.access_token);
            if (data.data.refresh_token) {
                this.saveRefreshToken(data.data.refresh_token);
            }
            this.saveUser(data.data.user);

            return data;
        } catch (error) {
            // Network error or fetch failed
            if (error instanceof TypeError) {
                console.error('Network error:', error);
                throw {
                    success: false,
                    msg: 'Cannot connect to server. Please check if backend is running.'
                };
            }
            throw error;
        }
    }

    //register
    async register(registerData: RegisterData): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(registerData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw data;
        }

        // Nếu BE yêu cầu verify email thì BE sẽ không trả access_token
        if (data?.data?.requires_verification) {
        // Không lưu token, chỉ trả data để UI hiện thông báo “check email”
            return data;
        }

        // Chỉ lưu token khi thật sự có access_token
        if (data?.data?.access_token) {
            this.saveToken(data.data.access_token);
        }
        if (data?.data?.refresh_token) {
            this.saveRefreshToken(data.data.refresh_token);
        }
        if (data?.data?.user) {
            this.saveUser(data.data.user);
        }

        return data;
    }


    //Google login
    async loginWithGoogle(googleData: GoogleLoginData): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/login/google`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(googleData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw data;
        }

        // Save token, refresh token and user
        this.saveToken(data.data.access_token);
        if (data.data.refresh_token) {
            this.saveRefreshToken(data.data.refresh_token);
        }
        this.saveUser(data.data.user);

        return data;
    }

    // Facebook Login
    async loginWithFacebook(facebookData: FacebookLoginData): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/login/facebook`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(facebookData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw data;
        }

        // Save token, refresh token and user
        this.saveToken(data.data.access_token);
        if (data.data.refresh_token) {
            this.saveRefreshToken(data.data.refresh_token);
        }
        this.saveUser(data.data.user);

        return data;
    }

    // Refresh access token
    async refreshAccessToken(): Promise<boolean> {
        const refreshToken = this.getRefreshToken();

        if (!refreshToken) {
            return false;
        }

        try {
            const response = await fetch(`${API_URL}/refresh`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ refresh_token: refreshToken }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                this.removeToken();
                return false;
            }

            // Save new tokens
            this.saveToken(data.data.access_token);
            if (data.data.refresh_token) {
                this.saveRefreshToken(data.data.refresh_token);
            }

            return true;
        } catch (error) {
            console.error('Token refresh failed:', error);
            this.removeToken();
            return false;
        }
    }

    // Fetch with automatic token refresh on 401
    async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
        // First attempt with current token
        const headers = this.getHeaders(true);
        const response = await fetch(url, {
            ...options,
            headers: { ...headers, ...options.headers },
        });

        // If 401 Unauthorized, try to refresh token and retry
        if (response.status === 401) {
            const refreshed = await this.refreshAccessToken();

            if (refreshed) {
                // Retry request with new token
                const newHeaders = this.getHeaders(true);
                return fetch(url, {
                    ...options,
                    headers: { ...newHeaders, ...options.headers },
                });
            } else {
                // Refresh failed, redirect to login
                if (typeof window !== 'undefined') {
                    window.location.href = '/auth/login';
                }
            }
        }

        return response;
    }

    // Logout
    async logout(): Promise<void> {
        try {
            await fetch(`${API_URL}/logout`, {
                method: 'POST',
                headers: this.getHeaders(true),
            });
        } finally {
            this.removeToken();
        }
    }

    // Get Profile
    async getProfile(): Promise<User> {
        const response = await this.fetchWithAuth(`${API_URL}/profile`, {
            method: 'GET',
        });

        const data = await response.json();

        if (!response.ok) {
            throw data;
        }

        this.saveUser(data.data);
        return data.data;
    }

    // Check if user is authenticated
    isAuthenticated(): boolean {
        return !!this.getToken();
    }
}
export default new authService();