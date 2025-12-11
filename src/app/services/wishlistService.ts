const API_URL = process.env.NEXT_PUBLIC_SERVER_API || 'http://127.0.0.1:8000/api';

interface WishlistResponse {
    success: boolean;
    data?: any;
    message?: string;
}

class WishlistService {
    private wishlistCache: string[] | null = null;
    private cacheTimestamp: number = 0;
    private CACHE_DURATION = 30000; // 30 seconds cache
    private inFlightRequest: Promise<string[]> | null = null;

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

    // Check if user is authenticated
    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    // Get wishlist (for authenticated users from API, for guests from localStorage)
    async getWishlist(): Promise<string[]> {
        // Check cache first
        const now = Date.now();
        if (this.wishlistCache && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
            return this.wishlistCache;
        }

        // If request is already in flight, wait for it
        if (this.inFlightRequest) {
            return this.inFlightRequest;
        }

        if (this.isAuthenticated()) {
            this.inFlightRequest = this.fetchWishlistFromAPI();
            const result = await this.inFlightRequest;
            this.inFlightRequest = null;
            return result;
        } else {
            return this.getFromLocalStorage();
        }
    }

    private async fetchWishlistFromAPI(): Promise<string[]> {
        try {
            const response = await fetch(`${API_URL}/wishlist`, {
                method: 'GET',
                headers: this.getHeaders(true),
            });

            if (!response.ok) {
                // If unauthorized, token expired - fall back to localStorage
                if (response.status === 401) {
                    console.warn('[WishlistService] Token expired in getWishlist, using localStorage');
                    return this.getFromLocalStorage();
                }
                throw new Error(`Failed to fetch wishlist: ${response.status}`);
            }

            const data = await response.json();
            if (data.success && data.data?.items) {
                const wishlist = data.data.items.map((item: any) => item.tourID.toString());
                this.wishlistCache = wishlist;
                this.cacheTimestamp = Date.now();
                return wishlist;
            }
            return [];
        } catch (error) {
            console.error('[WishlistService] Error fetching wishlist:', error);
            // Fall back to localStorage on any error
            return this.getFromLocalStorage();
        }
    }

    // Helper to get wishlist from localStorage
    private getFromLocalStorage(): string[] {
        const savedWishlist = localStorage.getItem('wishlist');
        const wishlist = savedWishlist ? JSON.parse(savedWishlist) : [];
        this.wishlistCache = wishlist;
        this.cacheTimestamp = Date.now();
        return wishlist;
    }

    // Toggle tour in wishlist
    async toggleWishlist(tourID: string): Promise<boolean> {
        if (this.isAuthenticated()) {
            try {
                const response = await fetch(`${API_URL}/wishlist/toggle/${tourID}`, {
                    method: 'POST',
                    headers: this.getHeaders(true),
                });

                if (!response.ok) {
                    // If unauthorized, token expired - fall back to localStorage
                    if (response.status === 401) {
                        console.warn('[WishlistService] Token expired, falling back to localStorage');
                        return this.toggleLocalStorage(tourID);
                    }
                    throw new Error(`Failed to toggle wishlist: ${response.status}`);
                }

                const data = await response.json();
                const inWishlist = data.success && data.data?.in_wishlist;
                // Clear cache and dispatch event
                this.wishlistCache = null;
                window.dispatchEvent(new Event('wishlist-updated'));
                return inWishlist;
            } catch (error) {
                console.error('[WishlistService] Error toggling wishlist:', error);
                // Fall back to localStorage on any error
                return this.toggleLocalStorage(tourID);
            }
        } else {
            return this.toggleLocalStorage(tourID);
        }
    }

    // Helper method to toggle in localStorage
    private toggleLocalStorage(tourID: string): boolean {
        const savedWishlist = localStorage.getItem('wishlist');
        let tourIDs: string[] = savedWishlist ? JSON.parse(savedWishlist) : [];

        // Ensure tourID is string for consistent comparison
        const tourIDStr = tourID.toString();
        const index = tourIDs.indexOf(tourIDStr);
        let inWishlist: boolean;
        if (index > -1) {
            tourIDs.splice(index, 1);
            inWishlist = false;
        } else {
            tourIDs.push(tourIDStr);
            inWishlist = true;
        }
        localStorage.setItem('wishlist', JSON.stringify(tourIDs));
        // Clear cache and dispatch event
        this.wishlistCache = tourIDs;
        this.cacheTimestamp = Date.now();
        window.dispatchEvent(new Event('wishlist-updated'));
        return inWishlist;
    }

    // Check if tour is in wishlist
    async isInWishlist(tourID: string): Promise<boolean> {
        const wishlist = await this.getWishlist();
        return wishlist.includes(tourID.toString());
    }

    // Remove tour from wishlist
    async removeFromWishlist(tourID: string): Promise<void> {
        if (this.isAuthenticated()) {
            try {
                const response = await fetch(`${API_URL}/wishlist/${tourID}`, {
                    method: 'DELETE',
                    headers: this.getHeaders(true),
                });

                if (!response.ok) {
                    // If unauthorized, token expired - fall back to localStorage
                    if (response.status === 401) {
                        console.warn('[WishlistService] Token expired, falling back to localStorage');
                        this.removeFromLocalStorage(tourID);
                        return;
                    }
                    throw new Error(`Failed to remove from wishlist: ${response.status}`);
                }

                // Clear cache and dispatch event
                this.wishlistCache = null;
                window.dispatchEvent(new Event('wishlist-updated'));
            } catch (error) {
                console.error('[WishlistService] Error removing from wishlist:', error);
                // Fall back to localStorage on any error
                this.removeFromLocalStorage(tourID);
            }
        } else {
            this.removeFromLocalStorage(tourID);
        }
    }

    // Helper method to remove from localStorage
    private removeFromLocalStorage(tourID: string): void {
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
            let tourIDs: string[] = JSON.parse(savedWishlist);
            tourIDs = tourIDs.filter(id => id.toString() !== tourID.toString());
            localStorage.setItem('wishlist', JSON.stringify(tourIDs));
            // Update cache and dispatch event
            this.wishlistCache = tourIDs;
            this.cacheTimestamp = Date.now();
            window.dispatchEvent(new Event('wishlist-updated'));
        }
    }

    // Sync localStorage wishlist to server when user logs in
    async syncWishlistOnLogin(): Promise<void> {
        if (!this.isAuthenticated()) return;

        const localWishlist = localStorage.getItem('wishlist');
        if (!localWishlist) return;

        const tourIDs: string[] = JSON.parse(localWishlist);
        if (tourIDs.length === 0) return;

        try {
            // Add all tours from localStorage to server
            for (const tourID of tourIDs) {
                await fetch(`${API_URL}/wishlist`, {
                    method: 'POST',
                    headers: this.getHeaders(true),
                    body: JSON.stringify({ tourID: parseInt(tourID) }),
                });
            }
            // Clear localStorage after sync
            localStorage.removeItem('wishlist');
        } catch (error) {
            console.error('Error syncing wishlist:', error);
        }
    }

    // Clear wishlist
    async clearWishlist(): Promise<void> {
        if (this.isAuthenticated()) {
            try {
                await fetch(`${API_URL}/wishlist/clear`, {
                    method: 'DELETE',
                    headers: this.getHeaders(true),
                });
            } catch (error) {
                console.error('Error clearing wishlist:', error);
                throw error;
            }
        } else {
            localStorage.removeItem('wishlist');
        }
    }
}

export const wishlistService = new WishlistService();
