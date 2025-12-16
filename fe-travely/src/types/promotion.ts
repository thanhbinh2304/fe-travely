export interface Promotion {
    promotionID: number;
    description: string;
    discount: number;
    startDate: string;
    endDate: string;
    quantity: number;
    code?: string;
    created_at?: string;
    updated_at?: string;
}

export interface CreatePromotionData {
    description: string;
    discount: number;
    startDate: string;
    endDate: string;
    quantity: number;
    code?: string;
}

export interface UpdatePromotionData {
    description?: string;
    discount?: number;
    startDate?: string;
    endDate?: string;
    quantity?: number;
    code?: string;
}

export interface ValidatePromotionData {
    code: string;
}