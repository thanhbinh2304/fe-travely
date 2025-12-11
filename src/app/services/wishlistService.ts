const API_URL = process.env.NEXT_PUBLIC_SERVER_API || 'http://127.0.0.1:8000/api';

interface WishlistResponse {
    success: boolean;
    data?: any;
    message?: string;
}

class WishlistService {
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
        if (this.isAuthenticated()) {
            try {
                const response = await fetch(`${API_URL}/wishlist`, {
                    method: 'GET',
                    headers: this.getHeaders(true),
                });
                const data = await response.json();
                if (data.success && data.data?.items) {
                    return data.data.items.map((item: any) => item.tourID.toString());
                }
                return [];
            } catch (error) {
                console.error('Error fetching wishlist:', error);
                return [];
            }
        } else {
            // Guest: get from localStorage
            const savedWishlist = localStorage.getItem('wishlist');
            return savedWishlist ? JSON.parse(savedWishlist) : [];
        }
    }

    // Toggle tour in wishlist
    async toggleWishlist(tourID: string): Promise<boolean> {
        console.log('[WishlistService] Toggling tour:', tourID, 'isAuthenticated:', this.isAuthenticated());
        if (this.isAuthenticated()) {
            try {
                const response = await fetch(`${API_URL}/wishlist/toggle/${tourID}`, {
                    method: 'POST',
                    headers: this.getHeaders(true),
                });
                const data = await response.json();
                const inWishlist = data.success && data.data?.in_wishlist;
                console.log('[WishlistService] API response:', data, 'inWishlist:', inWishlist);
                // Dispatch event to notify components
                window.dispatchEvent(new Event('wishlist-updated'));
                return inWishlist;
            } catch (error) {
                console.error('Error toggling wishlist:', error);
                throw error;
            }
        } else {
            // Guest: update localStorage
            const savedWishlist = localStorage.getItem('wishlist');
            let tourIDs: string[] = savedWishlist ? JSON.parse(savedWishlist) : [];
            console.log('[WishlistService] Current wishlist:', tourIDs);

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
            console.log('[WishlistService] Updated wishlist:', tourIDs, 'inWishlist:', inWishlist);
            // Dispatch event to notify components
            window.dispatchEvent(new Event('wishlist-updated'));
            return inWishlist;
        }
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
                await fetch(`${API_URL}/wishlist/${tourID}`, {
                    method: 'DELETE',
                    headers: this.getHeaders(true),
                });
                // Dispatch event to notify components
                window.dispatchEvent(new Event('wishlist-updated'));
            } catch (error) {
                console.error('Error removing from wishlist:', error);
                throw error;
            }
        } else {
            // Guest: update localStorage
            const savedWishlist = localStorage.getItem('wishlist');
            if (savedWishlist) {
                let tourIDs: string[] = JSON.parse(savedWishlist);
                tourIDs = tourIDs.filter(id => id.toString() !== tourID.toString());
                localStorage.setItem('wishlist', JSON.stringify(tourIDs));
                // Dispatch event to notify components
                window.dispatchEvent(new Event('wishlist-updated'));
            }
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
