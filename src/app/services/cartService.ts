const API_URL = process.env.NEXT_PUBLIC_SERVER_API || 'http://127.0.0.1:8000/api';
const STORAGE_KEY = 'travely_cart';

export interface CartItem {
    bookingID?: number; // Optional for guest cart (localStorage), required for authenticated cart (API)
    tourID: string;
    title: string;
    imageUrl: string;
    rating: number;
    reviewCount: number;
    date: string;
    time: string;
    adults: number;
    children: number;
    language: string;
    freeCancellation: boolean;
    originalPrice: number;
    discountedPrice: number;
    specialRequests?: string;
}

class CartService {
    private cartCache: CartItem[] | null = null;
    private cacheTimestamp: number = 0;
    private CACHE_DURATION = 10000; // 10 seconds cache

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
        // Check localStorage first (key: access_token)
        const localToken = localStorage.getItem('access_token');
        if (localToken) return localToken;

        // Check cookie as fallback
        const cookieToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('access_token='))
            ?.split('=')[1];

        return cookieToken || null;
    }

    // Get cart from localStorage (guest users)
    private getLocalCart(): CartItem[] {
        if (typeof window === 'undefined') return [];
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('[CartService] Error reading localStorage:', error);
            return [];
        }
    }

    // Save cart to localStorage (guest users)
    private saveLocalCart(items: CartItem[]): void {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
            window.dispatchEvent(new Event('cart-updated'));
        } catch (error) {
            console.error('[CartService] Error saving to localStorage:', error);
        }
    }

    // Sync localStorage cart to server after login
    async syncCartToServer(): Promise<void> {
        const token = this.getToken();
        if (!token) return;

        const localCart = this.getLocalCart();
        if (localCart.length === 0) return;

        console.log('[CartService] Syncing', localCart.length, 'items to server');

        try {
            // Add each item to server cart
            for (const item of localCart) {
                console.log('[CartService] Syncing item:', item);
                await fetch(`${API_URL}/cart`, {
                    method: 'POST',
                    headers: this.getHeaders(true),
                    body: JSON.stringify({
                        tourID: item.tourID.toString(),
                        bookingDate: item.date, // Use the actual date from cart item
                        numAdults: item.adults,
                        numChildren: item.children,
                        specialRequests: item.specialRequests || ''
                    }),
                }).catch(err => console.warn('[CartService] Failed to sync item:', item.tourID, err));
            }

            // Clear localStorage after successful sync
            localStorage.removeItem(STORAGE_KEY);
            this.cartCache = null;
            window.dispatchEvent(new Event('cart-updated'));
            console.log('[CartService] Cart synced successfully');
        } catch (error) {
            console.error('[CartService] Error syncing cart:', error);
        }
    }

    // Get cart items
    async getCart(): Promise<CartItem[]> {
        // Check cache
        const now = Date.now();
        if (this.cartCache && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
            console.log('[CartService] Returning cached cart');
            return this.cartCache;
        }

        const token = this.getToken();
        console.log('[CartService] getCart() - token:', token ? 'exists' : 'null');

        if (token) {
            try {
                console.log('[CartService] Fetching cart from API...');
                const response = await fetch(`${API_URL}/cart`, {
                    method: 'GET',
                    headers: this.getHeaders(true),
                });

                console.log('[CartService] API response status:', response.status);

                if (!response.ok) {
                    console.error('[CartService] GET /cart failed:', response.status, response.statusText);
                    if (response.status === 401) {
                        console.warn('[CartService] Token expired, falling back to localStorage');
                        return this.getLocalCart();
                    }
                    if (response.status === 400) {
                        const errorData = await response.json().catch(() => ({}));
                        console.error('[CartService] 400 Bad Request:', errorData);
                    }
                    throw new Error(`Failed to fetch cart: ${response.status}`);
                }

                const data = await response.json();
                console.log('[CartService] Cart data from API:', data);

                if (data.success && data.data?.items) {
                    // Transform backend data to frontend format
                    const items: CartItem[] = data.data.items.map((booking: any) => {
                        console.log('[CartService] Booking tour images:', booking.tour?.images);

                        // Ensure totalPrice is a number
                        const totalPrice = typeof booking.totalPrice === 'number' 
                            ? booking.totalPrice 
                            : parseFloat(booking.totalPrice) || 0;

                        return {
                            bookingID: booking.bookingID,
                            tourID: booking.tourID.toString(),
                            title: booking.tour?.title || '',
                            imageUrl: booking.tour?.images?.[0]?.imageUrl || booking.tour?.images?.[0]?.imageURL || '',
                            rating: booking.tour?.avg_rating || 0,
                            reviewCount: booking.tour?.review_count || 0,
                            date: new Date(booking.bookingDate).toLocaleDateString('vi-VN', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            }),
                            time: new Date(booking.bookingDate).toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit'
                            }),
                            adults: booking.numAdults,
                            children: booking.numChildren,
                            language: 'Tiếng Việt',
                            freeCancellation: true,
                            originalPrice: 0,
                            discountedPrice: totalPrice,
                            specialRequests: booking.specialRequests,
                        };
                    });

                    this.cartCache = items;
                    this.cacheTimestamp = Date.now();
                    return items;
                }
                return [];
            } catch (error) {
                console.error('[CartService] Error fetching cart:', error);
                return this.getLocalCart(); // Fallback to localStorage
            }
        } else {
            // Guest users: use localStorage
            return this.getLocalCart();
        }
    }

    // Add item to cart
    async addToCart(tourID: string, bookingDate: string, adults: number, children: number, specialRequests?: string, item?: Partial<CartItem>): Promise<void> {
        const token = this.getToken();
        if (token) {
            // Authenticated: use API
            try {
                console.log('[CartService] Adding to cart:', { tourID, bookingDate, adults, children });

                const response = await fetch(`${API_URL}/cart`, {
                    method: 'POST',
                    headers: this.getHeaders(true),
                    body: JSON.stringify({
                        tourID,
                        bookingDate,
                        numAdults: adults,
                        numChildren: children,
                        specialRequests: specialRequests || ''
                    }),
                });

                console.log('[CartService] POST /cart response status:', response.status);

                if (!response.ok) {
                    const error = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
                    console.error('[CartService] POST /cart failed:', response.status, error);
                    throw new Error(error.message || 'Failed to add to cart');
                }

                const data = await response.json();
                console.log('[CartService] POST /cart response data:', data);

                // Clear cache
                this.cartCache = null;
                console.log('[CartService] Cache cleared, dispatching cart-updated event');

                // Dispatch multiple events to ensure header receives it
                window.dispatchEvent(new Event('cart-updated'));
                window.dispatchEvent(new StorageEvent('storage', {
                    key: 'cart-trigger',
                    newValue: Date.now().toString(),
                    url: window.location.href
                }));
            } catch (error) {
                console.error('[CartService] Error adding to cart:', error);
                throw error;
            }
        } else {
            // Guest: use localStorage
            const localCart = this.getLocalCart();

            // Check if item already exists
            const existingIndex = localCart.findIndex(i => i.tourID === tourID && i.date === bookingDate);

            if (existingIndex !== -1) {
                // Update existing item
                localCart[existingIndex] = {
                    ...localCart[existingIndex],
                    adults,
                    children,
                    specialRequests,
                };
            } else {
                // Add new item (merge with provided item data)
                const newItem: CartItem = {
                    tourID,
                    title: item?.title || '',
                    imageUrl: item?.imageUrl || '',
                    rating: item?.rating || 0,
                    reviewCount: item?.reviewCount || 0,
                    date: bookingDate,
                    time: item?.time || '',
                    adults,
                    children,
                    language: item?.language || 'Tiếng Việt',
                    freeCancellation: item?.freeCancellation ?? true,
                    originalPrice: item?.originalPrice || 0,
                    discountedPrice: item?.discountedPrice || 0,
                    specialRequests,
                };
                localCart.push(newItem);
            }

            this.saveLocalCart(localCart);
        }
    }

    // Remove item from cart
    async removeFromCart(bookingIDOrTourID: number | string): Promise<void> {
        const token = this.getToken();
        if (token && typeof bookingIDOrTourID === 'number') {
            // Authenticated: use API with bookingID
            try {
                console.log('[CartService] Removing cart item:', bookingIDOrTourID);
                const response = await fetch(`${API_URL}/cart/${bookingIDOrTourID}`, {
                    method: 'DELETE',
                    headers: this.getHeaders(true),
                });

                console.log('[CartService] DELETE response status:', response.status);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
                    console.error('[CartService] DELETE failed:', errorData);
                    throw new Error(errorData.message || 'Failed to remove from cart');
                }

                const data = await response.json();
                console.log('[CartService] Item removed successfully:', data);

                // Clear cache
                this.cartCache = null;
                window.dispatchEvent(new Event('cart-updated'));
            } catch (error) {
                console.error('[CartService] Error removing from cart:', error);
                throw error;
            }
        } else {
            // Guest: use localStorage with tourID
            const localCart = this.getLocalCart();
            const filtered = localCart.filter(item =>
                item.bookingID !== bookingIDOrTourID && item.tourID !== bookingIDOrTourID.toString()
            );
            this.saveLocalCart(filtered);
        }
    }

    // Update item in cart
    async updateCartItem(bookingID: number, adults: number, children: number, bookingDate: string, specialRequests?: string): Promise<void> {
        const token = this.getToken();
        if (!token) return;

        try {
            const response = await fetch(`${API_URL}/cart/${bookingID}`, {
                method: 'PUT',
                headers: this.getHeaders(true),
                body: JSON.stringify({
                    numAdults: adults,
                    numChildren: children,
                    bookingDate,
                    specialRequests: specialRequests || ''
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to update cart');
            }

            // Clear cache
            this.cartCache = null;
            window.dispatchEvent(new Event('cart-updated'));
        } catch (error) {
            console.error('[CartService] Error updating cart:', error);
            throw error;
        }
    }

    // Clear cart
    async clearCart(): Promise<void> {
        const token = this.getToken();
        if (token) {
            // Authenticated: use API
            try {
                const response = await fetch(`${API_URL}/cart`, {
                    method: 'DELETE',
                    headers: this.getHeaders(true),
                });

                if (!response.ok) {
                    throw new Error('Failed to clear cart');
                }

                // Clear cache
                this.cartCache = null;
                window.dispatchEvent(new Event('cart-updated'));
            } catch (error) {
                console.error('[CartService] Error clearing cart:', error);
                throw error;
            }
        } else {
            // Guest: clear localStorage
            this.saveLocalCart([]);
        }
    }

    // Get cart count
    async getCartCount(): Promise<number> {
        const cart = await this.getCart();
        return cart.length;
    }

    // Calculate subtotal
    async getSubtotal(): Promise<number> {
        const cart = await this.getCart();
        return cart.reduce((sum, item) => sum + item.discountedPrice, 0);
    }

    // Clear cache (force refresh)
    clearCache(): void {
        this.cartCache = null;
        this.cacheTimestamp = 0;
        console.log('[CartService] Cache cleared');
    }
}

export const cartService = new CartService();
