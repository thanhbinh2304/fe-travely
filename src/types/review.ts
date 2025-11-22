export interface Review{
    reviewID: string;
    tourID: string;
    userID: string;
    rating: number;
    comment: string;
    created_at?: string;
    updated_at?: string;
    
    // User relation
    user?: {
        userID: string;
        userName: string;
        email: string;
    };
}