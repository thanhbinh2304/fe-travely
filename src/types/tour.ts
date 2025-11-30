import { Review } from "./review";
export interface Tour{
    tourID: string;
    title: string;
    description: string;
    quantity: number;
    priceAdult: number;
    priceChild: number;
    destination: string;
    availability: boolean;
    startDate: string;
    endDate: string;
    createdAt?: string;
    updatedAt?: string;
    //Relations
    images?: TourImage[];
    itineraries?: Itinerary[];
    reviews?: Review[];
    // Computed fields
    averageRating?: number;
    totalReviews?: number;
    mainImage?: string;
}

export interface TourImage{
    imageID: string;
    tourID: string;
    imageUrl: string;
    createdAt?: string;
}
export interface Itinerary{
    itineraryID: string;
    tourID: string;
    dayNumber: number;
    destination: string;
    activity: string;
    createdAt?: string;
}
export interface CreateTourData{
    title: string;
    description: string;
    quantity: number;
    priceAdult: number;
    priceChild: number;
    destination: string;
    availability: boolean;
    startDate: string;
    endDate: string;
}
export interface UpdateTourData extends Partial<CreateTourData>{}

export interface SearchParams{
    keyword?: string;
    destination?: string;
    minPrice?: number;
    maxPrice?: number;
    startDate?: string;
    availability?: boolean;
    endDate?: string;
}
export interface PaginationParams{
    page?: number;
    limit?: number;
}

export interface ApiResponse<T>{
    success: boolean;
    message: string;
    data: T;
    meta?: {
        currentPage: number;
        totalPages: number;
        per_page: number;
        last_page: number;
    };
}