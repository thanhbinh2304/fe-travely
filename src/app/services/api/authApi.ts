import { StringToBoolean } from "class-variance-authority/types";
import { API_BASE_URL } from "../../config/api";
const SERVER_API = process.env.SERVER_API || 'http://localhost:8000/api';
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}
export interface GoogleLoginData{
    google_id: string;
    email: string;
    name?: string;
}
export interface FacebookLoginData{
    facebook_id: string;
    email: String;
    name?: string;
}
export interface User {
    userID: string;
    userName: string;
    email: string;
    phoneNumber?: string;
    address?: string;
    role_id: number;
}

export interface AuthResponse {
    success: boolean;
    msg: string;
    token: string;
    data: {
        user: User;
        access_token: string;
    }
}
export interface ApiError {
    success: false;
    msg?: string;
    errors?: Record<string, string[]>;
}
class authApi {
    private getHeaders(includeAuth = false){
        const headers: Record<string,string> ={
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };

        if(includeAuth){
            const token= this.getToken();
            if(token) {
                headers['Authorization']= `Bearer ${token}`;
            }
        }
        return headers;
    }

    // get token from localStorage
    getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('access_token');
    }
    //save token to localStorage
    saveToken(token: string): void{
        if(typeof window === 'undefined') return;
        localStorage.setItem('access_token',token);
    } 
    //remove token from localStorage 
    removeToken(): void {
        if(typeof window === 'undefined') return;
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
    }

    //save user to localStorage
    saveUser(user: User): void {
        if(typeof window === 'undefined') return;
        localStorage.setItem('user', JSON.stringify(user));
    }
    //get user from localStorage
    getUser(): User | null{ 
        if (typeof window === 'undefined') return null;
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }


    //Login
    async login(credentials: LoginCredentials) : Promise<AuthResponse>{
        const response = await fetch(`${SERVER_API}/login`, {
            method : 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(credentials),
        });

        const data = await response.json();
        if (!response.ok){
            throw data;
        }

        //save token and user
        this.saveToken(data.data.access_token);
        this.saveUser(data.data.user);

        return data;
    }

    //register
    async register(registerData: RegisterData): Promise<AuthResponse> {
        const response = await fetch(`${SERVER_API}/register`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(registerData),
        });

        const data = await response.json();

        if (!response.ok) {
        throw data;
        }

        // Save token and user
        this.saveToken(data.data.access_token);
        this.saveUser(data.data.user);

        return data;
    }


    //Google login
    async loginWithGoogle(googleData: GoogleLoginData): Promise<AuthResponse> {
        const response = await fetch(`${SERVER_API}/login/google`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(googleData),
        });

        const data = await response.json();

        if (!response.ok) {
        throw data;
        }

        // Save token and user
        this.saveToken(data.data.access_token);
        this.saveUser(data.data.user);

        return data;
    }

    // Facebook Login
    async loginWithFacebook(facebookData: FacebookLoginData): Promise<AuthResponse> {
        const response = await fetch(`${SERVER_API}/login/facebook`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(facebookData),
        });

        const data = await response.json();

        if (!response.ok) {
        throw data;
        }

        // Save token and user
        this.saveToken(data.data.access_token);
        this.saveUser(data.data.user);

        return data;
    }

    // Logout
    async logout(): Promise<void> {
        try {
        await fetch(`${SERVER_API}/logout`, {
            method: 'POST',
            headers: this.getHeaders(true),
        });
        } finally {
        this.removeToken();
        }
    }

    // Get Profile
    async getProfile(): Promise<User> {
        const response = await fetch(`${SERVER_API}/profile`, {
        method: 'GET',
        headers: this.getHeaders(true),
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
export default new authApi();