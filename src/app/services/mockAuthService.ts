import { User, LoginCredentials, RegisterData, AuthResponse } from "../../types/auth";

// Mock users - bạn có thể thêm nhiều users tùy ý
const MOCK_USERS: User[] = [
    {
        userID: '1',
        userName: 'admin',
        email: 'admin@travely.com',
        phoneNumber: '0123456789',
        address: 'Admin Address',
        role_id: 1, // Admin role
    },
    {
        userID: '2',
        userName: 'user',
        email: 'user@travely.com',
        phoneNumber: '0987654321',
        address: 'User Address',
        role_id: 2, // Normal user role
    }
];

// Mock password cho tất cả users (trong dev mode)
const MOCK_PASSWORD = '123456';

class MockAuthService {
    private getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
    }

    // Get token from localStorage and cookie
    getToken(): string | null {
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

    private setCookie(name: string, value: string, days = 7): void {
        if (typeof document === 'undefined') return;
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
    }

    private deleteCookie(name: string): void {
        if (typeof document === 'undefined') return;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }

    saveToken(token: string): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem('access_token', token);
        this.setCookie('access_token', token, 7);
    }

    saveRefreshToken(refreshToken: string): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem('refresh_token', refreshToken);
    }

    getRefreshToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('refresh_token');
    }

    removeToken(): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        this.deleteCookie('access_token');
    }

    saveUser(user: User): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem('user', JSON.stringify(user));
    }

    getUser(): User | null {
        if (typeof window === 'undefined') return null;
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    // Mock login - không cần backend
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        console.log('[MOCK MODE] Login attempt:', credentials.login);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Find user by username or email
        const user = MOCK_USERS.find(u =>
            u.userName === credentials.login || u.email === credentials.login
        );

        if (!user) {
            throw {
                success: false,
                msg: 'Username or email not found'
            };
        }

        // Check password (trong mock mode, tất cả đều dùng password '123456')
        if (credentials.password !== MOCK_PASSWORD) {
            throw {
                success: false,
                msg: 'Incorrect password'
            };
        }

        // Generate mock token
        const mockToken = `mock_token_${user.userID}_${Date.now()}`;

        // Save token and user
        this.saveToken(mockToken);
        this.saveUser(user);

        console.log('[MOCK MODE] Login successful:', user.userName);

        return {
            success: true,
            msg: 'Login successful',
            token: mockToken,
            data: {
                access_token: mockToken,
                user: user
            }
        };
    }

    // Mock register
    async register(registerData: RegisterData): Promise<AuthResponse> {
        console.log('[MOCK MODE] Register attempt:', registerData.userName);

        await new Promise(resolve => setTimeout(resolve, 500));

        // Check if username or email already exists
        const existingUser = MOCK_USERS.find(u =>
            u.userName === registerData.userName || u.email === registerData.email
        );

        if (existingUser) {
            throw {
                success: false,
                msg: 'Username or email already exists'
            };
        }

        // Create new mock user
        const newUser: User = {
            userID: String(MOCK_USERS.length + 1),
            userName: registerData.userName,
            email: registerData.email,
            role_id: 2, // Normal user
        };

        // Add to mock users (only for this session)
        MOCK_USERS.push(newUser);

        const mockToken = `mock_token_${newUser.userID}_${Date.now()}`;
        this.saveToken(mockToken);
        this.saveUser(newUser);

        console.log('[MOCK MODE] Register successful:', newUser.userName);

        return {
            success: true,
            msg: 'Registration successful',
            token: mockToken,
            data: {
                access_token: mockToken,
                user: newUser
            }
        };
    }

    // Mock get profile
    async getProfile(): Promise<User> {
        console.log('[MOCK MODE] Getting profile');
        await new Promise(resolve => setTimeout(resolve, 200));

        const user = this.getUser();
        if (!user) {
            throw {
                success: false,
                msg: 'Not authenticated'
            };
        }
        return user;
    }

    // Mock logout
    async logout(): Promise<void> {
        console.log('[MOCK MODE] Logout');
        await new Promise(resolve => setTimeout(resolve, 200));
        this.removeToken();
    }

    // Check if authenticated
    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    // Mock Google login
    async loginWithGoogle(googleData: any): Promise<AuthResponse> {
        console.log('[MOCK MODE] Google login');
        await new Promise(resolve => setTimeout(resolve, 500));

        const mockUser: User = {
            userID: '999',
            userName: `google_${Date.now()}`,
            email: googleData.email || 'google@example.com',
            role_id: 2,
        };

        const mockToken = `mock_token_google_${Date.now()}`;
        this.saveToken(mockToken);
        this.saveUser(mockUser);

        return {
            success: true,
            msg: 'Google login successful',
            token: mockToken,
            data: {
                access_token: mockToken,
                user: mockUser
            }
        };
    }

    // Mock Facebook login
    async loginWithFacebook(facebookData: any): Promise<AuthResponse> {
        console.log('[MOCK MODE] Facebook login');
        await new Promise(resolve => setTimeout(resolve, 500));

        const mockUser: User = {
            userID: '998',
            userName: `facebook_${Date.now()}`,
            email: facebookData.email || 'facebook@example.com',
            role_id: 2,
        };

        const mockToken = `mock_token_facebook_${Date.now()}`;
        this.saveToken(mockToken);
        this.saveUser(mockUser);

        return {
            success: true,
            msg: 'Facebook login successful',
            token: mockToken,
            data: {
                access_token: mockToken,
                user: mockUser
            }
        };
    }
}

export default new MockAuthService();
