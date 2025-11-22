import { ApiResponse, CreateTourData, PaginationParams, SearchParams, Tour, UpdateTourData } from "@/types/tour";
import { Review } from "@/types/review";
const API_URL = process.env.SERVER_API || 'http://localhost:8000/api';



class TourService {
   private getHeaders(includeAuth = false) {
        const headers: Record <string, string> = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
        if (includeAuth){
            const token = localStorage.getItem('access_token');
            if(token){
                headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return headers;
    }
    //Get all tours
    async index(params?: PaginationParams): Promise<ApiResponse<Tour[]>> {
        const queryParams = new URLSearchParams();

        if(params?.page) queryParams.append('page', params.page.toString());
        if(params?.limit) queryParams.append('limit', params.limit.toString());

        const response = await fetch(`${API_URL}/tours?${queryParams.toString()}`, {
            method:'GET',
            headers: this.getHeaders(),
        });
        const data = await response.json();
        if (!response.ok){
            throw data;
        }
        return data;
    }

    // Save a new tour
    async store(tourData: CreateTourData): Promise<ApiResponse<Tour>> {
        const response = await fetch(`${API_URL}/tours`, {
            method: 'POST',
            headers: this.getHeaders(true),
            body: JSON.stringify(tourData),
        });
        const data = await response.json();
        if (!response.ok){
            throw data;
        }
        return data;
    }

    //Show a tour details 
    async show(tourID: string): Promise <ApiResponse<Tour>> {
        const response = await fetch(`${API_URL}/tours/${tourID}`, {
            method: 'GET',
            headers: this.getHeaders(),
        });

        const data = await response.json();
        if (!response.ok){
            throw data;
        }
        return data;
    }

    async update(tourID: string, tourData: UpdateTourData): Promise<ApiResponse<Tour>> {
        const response = await fetch(`${API_URL}/tours/${tourID}`, {
            method : 'PUT',
            headers: this.getHeaders(true),
            body: JSON.stringify(tourData),
        });

        const data = await response.json();
        if (!response.ok){
            throw data;
        }
        return data;
    }

    // Delete a tour
    async destroy(tourID: string): Promise <ApiResponse<null>> {
        const response = await fetch(`${API_URL}/tours/${tourID}`, {
            method: 'DELETE',
            headers: this.getHeaders(true),
        });
        const data = await response.json();
        if (!response.ok){
            throw data;
        }
        return data;
    }

    //get featured tours
    async featured(limit?:number): Promise<ApiResponse<Tour[]>> {
        const queryParams = limit ? `?limit= ${limit}`: '';

        const response = await fetch(`${API_URL}/tours/featured${queryParams}`, {
            method: 'GET',
            headers: this.getHeaders(),
        });
        const data = await response.json();
        if (!response.ok){
            throw data;
        }
        return data;
    }

    //search tours 
    async search(params: SearchParams & PaginationParams): Promise<ApiResponse<Tour[]>> {
        const queryParams = new URLSearchParams();
        
        if (params.keyword) queryParams.append('keyword', params.keyword);
        if (params.destination) queryParams.append('destination', params.destination);
        if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
        if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);
        if (params.availability !== undefined) queryParams.append('availability', params.availability.toString());
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());

        const response = await fetch(`${API_URL}/tours/search?${queryParams.toString()}`, {
        method: 'GET',
        headers: this.getHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
        throw data;
        }

        return data;
    }
    
    // get available tours
    async available(params?: PaginationParams): Promise<ApiResponse<Tour[]>> {
        const queryParams = new URLSearchParams();
        
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());

        const response = await fetch(`${API_URL}/tours/available?${queryParams.toString()}`, {
        method: 'GET',
        headers: this.getHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
        throw data;
        }

        return data;
    }

    // get tour by destination
    async byDestination(destination: string, params?: PaginationParams): Promise<ApiResponse<Tour[]>> {
        const queryParams = new URLSearchParams();
        
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());

        const response = await fetch(`${API_URL}/tours/destination/${destination}?${queryParams.toString()}`, {
        method: 'GET',
        headers: this.getHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
        throw data;
        }

        return data;
    }

    // update tour availability
    async updateAvailability(tourID: string, availability: boolean): Promise<ApiResponse<Tour>> {
        const response = await fetch(`${API_URL}/tours/${tourID}/availability`, {
        method: 'PATCH',
        headers: this.getHeaders(true), // Require auth
        body: JSON.stringify({ availability }),
        });

        const data = await response.json();

        if (!response.ok) {
        throw data;
        }

        return data;
    }

    //update quantity
    async updateQuantity(tourID: string, quantity: number): Promise<ApiResponse<Tour>> {
        const response = await fetch(`${API_URL}/tours/${tourID}/quantity`, {
        method: 'PATCH',
        headers: this.getHeaders(true), // Require auth
        body: JSON.stringify({ quantity }),
        });

        const data = await response.json();

        if (!response.ok) {
        throw data;
        }

        return data;
    }

    //get tour duration in days
    getTourDuration(startDate: string, endDate: string): number {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diff = end.getTime() - start.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    //format price
    formatPrice(price: number, currency: string = 'USD'): string {
        return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        }).format(price);
    }

    //check tour availability
    isTourAvailable(tour: Tour): boolean {
        return tour.availability && tour.quantity > 0;
    }
    //get main image
    getMainImage(tour: Tour): string {
        return tour.images?.[0]?.imageUrl || '/images/placeholder-tour.jpg';
    }
}
export const tourService = new TourService();