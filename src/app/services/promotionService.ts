import { ApiResponse } from "@/types/booking";
import { Promotion, CreatePromotionData, UpdatePromotionData, ValidatePromotionData } from "@/types/promotion";

const API_URL = process.env.NEXT_PUBLIC_SERVER_API || 'http://127.0.0.1:8000/api';

class PromotionService {
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

    // Get all promotions
    async getPromotions(params?: { active?: boolean , per_page?: number }): Promise<ApiResponse<Promotion[]>> {
        const queryParams = new URLSearchParams();
        if (params?.active !== undefined) {
            queryParams.append('active', params.active.toString());
        }
        if (params?.per_page !== undefined) {
            queryParams.append('per_page', params.per_page.toString());
        }
        const response = await fetch(`${API_URL}/promotions?${queryParams.toString()}`, {
            method: 'GET',
            headers: this.getHeaders(),
        });

        const data = await response.json();
        if (!response.ok) {
            throw data;
        }
        return data;
    }

    // Get promotion by ID
    async getPromotion(id: number): Promise<ApiResponse<Promotion>> {
        const response = await fetch(`${API_URL}/promotions/${id}`, {
            method: 'GET',
            headers: this.getHeaders(),
        });

        const data = await response.json();
        if (!response.ok) {
            throw data;
        }
        return data;
    }

    // Create new promotion
    async createPromotion(promotionData: CreatePromotionData): Promise<ApiResponse<Promotion>> {
        const token = this.getToken();
        console.log('PromotionService - Token:', token ? 'Present' : 'Missing');

        const response = await fetch(`${API_URL}/promotions`, {
            method: 'POST',
            headers: this.getHeaders(true),
            body: JSON.stringify(promotionData),
        });

        console.log('PromotionService - Response status:', response.status);
        console.log('PromotionService - Response headers:', Object.fromEntries(response.headers.entries()));

        const data = await response.json();
        console.log('PromotionService - Response data:', data);

        if (!response.ok) {
            throw data;
        }
        return data;
    }

    // Update promotion
    async updatePromotion(id: number, promotionData: UpdatePromotionData): Promise<ApiResponse<Promotion>> {
        const response = await fetch(`${API_URL}/promotions/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(true),
            body: JSON.stringify(promotionData),
        });

        const data = await response.json();
        if (!response.ok) {
            throw data;
        }
        return data;
    }

    // Delete promotion
    async deletePromotion(id: number): Promise<ApiResponse<void>> {
        const response = await fetch(`${API_URL}/promotions/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders(true),
        });

        const data = await response.json();
        if (!response.ok) {
            throw data;
        }
        return data;
    }

    // Validate promotion code
    async validatePromotionCode(codeData: ValidatePromotionData): Promise<ApiResponse<Promotion>> {
        const response = await fetch(`${API_URL}/promotions/validate`, {
            method: 'POST',
            headers: this.getHeaders(true),
            body: JSON.stringify(codeData),
        });

        const data = await response.json();
        if (!response.ok) {
            throw data;
        }
        return data;
    }
}

export const promotionService = new PromotionService();