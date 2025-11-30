export interface LoginCredentials {
    login: string;  // Backend expects 'login' field (email or username)
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}
export interface GoogleLoginData {
    google_id: string;
    email: string;
    name?: string;
}
export interface FacebookLoginData {
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