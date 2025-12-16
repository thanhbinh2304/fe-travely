import { ApiResponse, CreateTourData, PaginationParams, SearchParams, Tour, UpdateTourData } from "@/types/tour";
import { Review } from "@/types/review";
const API_URL = process.env.NEXT_PUBLIC_SERVER_API || 'https://backend-travely.onrender.com/api';

interface TourFilters {
    destination?: string;
    availability?: boolean;
    min_price?: number;
    max_price?: number;
    start_date?: string;
    end_date?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
}

class TourService {
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

    //Get all tours with filters (Public)
    async index(filters?: TourFilters): Promise<ApiResponse<Tour[]>> {
        const queryParams = new URLSearchParams();

        if (filters?.page) queryParams.append('page', filters.page.toString());
        if (filters?.per_page) queryParams.append('per_page', filters.per_page.toString());
        if (filters?.destination) queryParams.append('destination', filters.destination);
        if (filters?.availability !== undefined) queryParams.append('availability', filters.availability.toString());
        if (filters?.min_price) queryParams.append('min_price', filters.min_price.toString());
        if (filters?.max_price) queryParams.append('max_price', filters.max_price.toString());
        if (filters?.start_date) queryParams.append('start_date', filters.start_date);
        if (filters?.end_date) queryParams.append('end_date', filters.end_date);
        if (filters?.sort_by) queryParams.append('sort_by', filters.sort_by);
        if (filters?.sort_order) queryParams.append('sort_order', filters.sort_order);

        const response = await fetch(`${API_URL}/tours?${queryParams.toString()}`, {
            method: 'GET',
            headers: this.getHeaders(),
        });
        const data = await response.json();
        if (!response.ok) {
            throw data;
        }
        return data;
    }

    // Get all tours for admin (with auth)
    async getAllTours(filters?: TourFilters): Promise<Tour[]> {
        try {
            const queryParams = new URLSearchParams();

            if (filters?.page) queryParams.append('page', filters.page.toString());
            if (filters?.per_page) queryParams.append('per_page', filters.per_page.toString());
            if (filters?.destination) queryParams.append('destination', filters.destination);
            if (filters?.availability !== undefined) queryParams.append('availability', filters.availability.toString());
            if (filters?.min_price) queryParams.append('min_price', filters.min_price.toString());
            if (filters?.max_price) queryParams.append('max_price', filters.max_price.toString());
            if (filters?.start_date) queryParams.append('start_date', filters.start_date);
            if (filters?.end_date) queryParams.append('end_date', filters.end_date);
            if (filters?.sort_by) queryParams.append('sort_by', filters.sort_by);
            if (filters?.sort_order) queryParams.append('sort_order', filters.sort_order);

            const url = `${API_URL}/admin/tours${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
            console.log('Fetching tours from:', url);

            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(true),
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Response error:', errorText);
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const result = await response.json();
            console.log('Response data:', result);

            if (!result.success) {
                throw new Error(result.message || 'Failed to fetch tours');
            }

            // Handle paginated response - Laravel returns data in data.data for pagination
            if (result.data && result.data.data && Array.isArray(result.data.data)) {
                return result.data.data;
            } else if (Array.isArray(result.data)) {
                return result.data;
            } else {
                console.warn('Unexpected data structure:', result);
                return [];
            }
        } catch (error) {
            console.error('Error fetching tours:', error);
            throw error;
        }
    }

    // Upload tour image
    async uploadImage(file: File): Promise<{ url: string }> {
        const formData = new FormData();
        formData.append('image', file);

        const token = this.getToken();
        const response = await fetch(`${API_URL}/tours/upload-image`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: formData,
        });

        const data = await response.json();
        if (!response.ok) {
            throw data;
        }
        return data.data;
    }

    // Save a new tour with file uploads
    async store(tourData: CreateTourData, imageFiles?: File[]): Promise<ApiResponse<Tour>> {
        const formData = new FormData();

        // Add tour data
        Object.keys(tourData).forEach((key) => {
            const value = tourData[key as keyof CreateTourData];
            if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    value.forEach((item, index) => {
                        if (typeof item === 'object') {
                            Object.keys(item).forEach((subKey) => {
                                const val = (item as Record<string, unknown>)[subKey];
                                formData.append(`${key}[${index}][${subKey}]`, String(val));
                            });
                        } else {
                            formData.append(`${key}[]`, String(item));
                        }
                    });
                } else {
                    // Convert boolean to 0/1 for Laravel
                    if (key === 'availability' && typeof value === 'boolean') {
                        formData.append(key, value ? '1' : '0');
                    } else {
                        formData.append(key, String(value));
                    }
                }
            }
        });

        // Add image files
        if (imageFiles && imageFiles.length > 0) {
            imageFiles.forEach((file) => {
                formData.append('image_files[]', file);
            });
        }

        const token = this.getToken();
        const response = await fetch(`${API_URL}/tours`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: formData,
        });

        const data = await response.json();
        if (!response.ok) {
            throw data;
        }
        return data;
    }

    //Show a tour details (Public)
    async show(tourID: string): Promise<ApiResponse<Tour>> {
        const response = await fetch(`${API_URL}/tours/${tourID}`, {
            method: 'GET',
            headers: this.getHeaders(),
        });

        const data = await response.json();
        if (!response.ok) {
            throw data;
        }
        return data;
    }

    // Get tour by ID for admin (with auth)
    async getTourById(tourID: string): Promise<Tour> {
        try {
            console.log('Fetching tour:', tourID);
            const response = await fetch(`${API_URL}/admin/tours/${tourID}`, {
                method: 'GET',
                headers: this.getHeaders(true),
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Response error:', errorText);
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const result = await response.json();
            console.log('Tour detail response:', result);

            if (!result.success || !result.data) {
                throw new Error(result.message || 'Failed to fetch tour details');
            }

            return result.data;
        } catch (error) {
            console.error('Error fetching tour details:', error);
            throw error;
        }
    }

    async update(tourID: string, tourData: UpdateTourData, imageFiles?: File[]): Promise<ApiResponse<Tour>> {
        // If there are files, use FormData
        if (imageFiles && imageFiles.length > 0) {
            const formData = new FormData();

            // Add tour data
            Object.keys(tourData).forEach((key) => {
                const value = tourData[key as keyof UpdateTourData];
                if (value !== undefined && value !== null) {
                    if (Array.isArray(value)) {
                        value.forEach((item, index) => {
                            if (typeof item === 'object') {
                                Object.keys(item).forEach((subKey) => {
                                    const val = (item as Record<string, unknown>)[subKey];
                                    formData.append(`${key}[${index}][${subKey}]`, String(val));
                                });
                            } else {
                                formData.append(`${key}[]`, String(item));
                            }
                        });
                    } else {
                        // Convert boolean to 0/1 for Laravel
                        if (key === 'availability' && typeof value === 'boolean') {
                            formData.append(key, value ? '1' : '0');
                        } else {
                            formData.append(key, String(value));
                        }
                    }
                }
            });

            // Add image files
            imageFiles.forEach((file) => {
                formData.append('image_files[]', file);
            });

            // Add _method to override POST as PUT for Laravel
            formData.append('_method', 'PUT');

            const token = this.getToken();
            const response = await fetch(`${API_URL}/tours/${tourID}`, {
                method: 'POST', // Use POST for multipart/form-data
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) {
                throw data;
            }
            return data;
        }

        // Otherwise use JSON
        const response = await fetch(`${API_URL}/tours/${tourID}`, {
            method: 'PUT',
            headers: this.getHeaders(true),
            body: JSON.stringify(tourData),
        });

        const data = await response.json();
        if (!response.ok) {
            throw data;
        }
        return data;
    }

    // Delete a tour
    async destroy(tourID: string): Promise<ApiResponse<null>> {
        const response = await fetch(`${API_URL}/tours/${tourID}`, {
            method: 'DELETE',
            headers: this.getHeaders(true),
        });
        const data = await response.json();
        if (!response.ok) {
            throw data;
        }
        return data;
    }

    // Delete tour for admin (simplified)
    async deleteTour(tourID: string): Promise<void> {
        try {
            const response = await fetch(`${API_URL}/tours/${tourID}`, {
                method: 'DELETE',
                headers: this.getHeaders(true),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Failed to delete tour');
            }
        } catch (error) {
            console.error('Error deleting tour:', error);
            throw error;
        }
    }

    //get featured tours
    async featured(limit?: number): Promise<ApiResponse<Tour[]>> {
        const queryParams = limit ? `?limit= ${limit}` : '';

        const response = await fetch(`${API_URL}/tours/featured${queryParams}`, {
            method: 'GET',
            headers: this.getHeaders(),
        });
        const data = await response.json();
        if (!response.ok) {
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

    // Toggle tour availability for admin (simplified)
    async toggleAvailability(tourID: string): Promise<Tour> {
        try {
            // First get current tour data
            const tour = await this.getTourById(tourID);
            const newAvailability = !tour.availability;

            const response = await fetch(`${API_URL}/tours/${tourID}/availability`, {
                method: 'PATCH',
                headers: this.getHeaders(true),
                body: JSON.stringify({ availability: newAvailability }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const result = await response.json();

            if (!result.success || !result.data) {
                throw new Error(result.message || 'Failed to toggle availability');
            }

            return result.data;
        } catch (error) {
            console.error('Error toggling availability:', error);
            throw error;
        }
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
        console.log('getMainImage called for tour:', tour.tourID);
        console.log('tour.images:', tour.images);

        // Check if tour has images array
        if (tour.images && Array.isArray(tour.images) && tour.images.length > 0) {
            const firstImage = tour.images[0];
            console.log('First image:', firstImage);
            // Try imageUrl first (from accessor), fallback to imageURL
            const imageUrl = firstImage.imageUrl || firstImage.imageURL || 'https://placehold.co/800x600/e5e7eb/6b7280?text=No+Image';
            console.log('Resolved imageUrl:', imageUrl);
            return imageUrl;
        }
        console.log('No images found, using placeholder');
        // Fallback to placeholder
        return 'https://placehold.co/800x600/e5e7eb/6b7280?text=No+Image';
    }
}
export const tourService = new TourService();