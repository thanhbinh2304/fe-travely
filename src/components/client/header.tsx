'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Heart, ShoppingCart, Globe, User, ChevronDown, LogIn, Bell, Sun, HelpCircle, ChevronRight, Calendar, LogOut } from 'lucide-react';
import { useScrollSearch } from '@/hooks/useScrollSearch';
import SearchBar from './SearchBar';
import { useAuth } from '@/hooks/useAuth';
import { LoginModal } from '@/components/client/login';
import { wishlistService } from '@/app/services/wishlistService';
import { cartService } from '@/app/services/cartService';

type DropdownType = 'places' | 'things' | 'trip' | 'profile' | null;

export default function HeaderClient() {
    const [scrolled, setScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [loginModalMode, setLoginModalMode] = useState<'login' | 'register' | 'forgot-password' | 'reset-password'>('login');
    const [loginModalToken, setLoginModalToken] = useState<string>('');
    const [wishlistCount, setWishlistCount] = useState(0);
    const [cartCount, setCartCount] = useState(0);
    const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const { showSearchInHeader } = useScrollSearch();
    const { user, isAuthenticated, logout, refreshUser } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSearch = (query: string) => {
        if (query.trim()) {
            router.push(`/tours?search=${encodeURIComponent(query.trim())}`);
        }
    };

    const updateWishlistCount = async () => {
        const wishlist = await wishlistService.getWishlist();
        setWishlistCount(wishlist.length);
    };

    const updateCartCount = async () => {
        console.log('[Header] Updating cart count...');
        // Force clear cache before getting count
        cartService.clearCache();
        const count = await cartService.getCartCount();
        console.log('[Header] Cart count:', count);
        setCartCount(count);
    };

    // Check for query params to auto-open login modal
    useEffect(() => {
        const verified = searchParams.get('verified');
        const reset = searchParams.get('reset');
        const token = searchParams.get('token');

        if (verified === 'true') {
            setLoginModalMode('login');
            setIsLoginModalOpen(true);
            // Clean up URL after a short delay
            setTimeout(() => router.replace('/'), 100);
        } else if (reset === 'true') {
            setLoginModalMode('reset-password');
            setLoginModalToken(token || '');
            setIsLoginModalOpen(true);
            // Clean up URL after a short delay
            setTimeout(() => router.replace('/'), 100);
        }
    }, [searchParams, router]);

    useEffect(() => {
        console.log('[Header] Component mounted, setting up listeners');
        // Initial counts
        updateWishlistCount();
        updateCartCount();

        // Listen for wishlist updates
        const handleWishlistUpdate = () => {
            console.log('[Header] wishlist-updated event received');
            updateWishlistCount();
        };

        // Listen for cart updates
        const handleCartUpdate = () => {
            console.log('[Header] cart-updated event received');
            updateCartCount();
        };

        const handleStorageChange = (e: StorageEvent) => {
            console.log('[Header] storage event received:', e.key);
            if (e.key === 'cart-trigger') {
                console.log('[Header] cart-trigger detected, updating count');
                updateCartCount();
            }
        };

        window.addEventListener('wishlist-updated', handleWishlistUpdate);
        window.addEventListener('cart-updated', handleCartUpdate);
        window.addEventListener('storage', handleStorageChange as any);

        return () => {
            console.log('[Header] Component unmounting, removing listeners');
            window.removeEventListener('wishlist-updated', handleWishlistUpdate);
            window.removeEventListener('cart-updated', handleCartUpdate);
            window.removeEventListener('storage', handleStorageChange as any);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleDropdownEnter = (dropdown: DropdownType) => {
        if (dropdownTimeoutRef.current) {
            clearTimeout(dropdownTimeoutRef.current);
        }
        setActiveDropdown(dropdown);
    };

    const handleDropdownLeave = () => {
        dropdownTimeoutRef.current = setTimeout(() => {
            setActiveDropdown(null);
        }, 300);
    };

    const handleLoginClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setActiveDropdown(null); // Đóng dropdown
        setIsLoginModalOpen(true); // Mở modal
    };
    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();
        setActiveDropdown(null);
        await logout();
        // Optional: redirect to home
        // router.push('/');
    };
    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-md">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center">
                            <div className="text-red-500 font-bold text-2xl">
                                <span className="block leading-tight">TRAVELY</span>
                            </div>
                        </Link>

                        {/* Search Bar in Header (appears when scrolled past banner) */}
                        {showSearchInHeader && (
                            <div className="flex-1 max-w-2xl mx-8">
                                <SearchBar className="scale-90" onSearch={handleSearch} />
                            </div>
                        )}

                        {/* Navigation Menu */}
                        {!showSearchInHeader && (
                            <nav className="hidden md:flex items-center space-x-8">
                                {/* Places to see */}
                                {/* <div
                                    className="relative group"
                                    onMouseEnter={() => handleDropdownEnter('places')}
                                    onMouseLeave={handleDropdownLeave}
                                >
                                    <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition">
                                        <span>Places to see</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                    {activeDropdown === 'places' && (
                                        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                                            <Link href="/places/museums" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                                Museums
                                            </Link>
                                            <Link href="/places/attractions" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                                Attractions
                                            </Link>
                                            <Link href="/places/landmarks" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                                Landmarks
                                            </Link>
                                        </div>
                                    )}
                                </div> */}

                                {/* Things to do */}
                                {/* <div
                                    className="relative group"
                                    onMouseEnter={() => handleDropdownEnter('things')}
                                    onMouseLeave={handleDropdownLeave}
                                >
                                    <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition">
                                        <span>Things to do</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                    {activeDropdown === 'things' && (
                                        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                                            <Link href="/things/tours" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                                Tours
                                            </Link>
                                            <Link href="/things/activities" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                                Activities
                                            </Link>
                                            <Link href="/things/experiences" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                                Experiences
                                            </Link>
                                        </div>
                                    )}
                                </div> */}

                                {/* Trip inspiration */}
                                {/* <div
                                    className="relative group"
                                    onMouseEnter={() => handleDropdownEnter('trip')}
                                    onMouseLeave={handleDropdownLeave}
                                >
                                    <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition">
                                        <span>Trip inspiration</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                    {activeDropdown === 'trip' && (
                                        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                                            <Link href="/inspiration/guides" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                                Travel Guides
                                            </Link>
                                            <Link href="/inspiration/itineraries" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                                Itineraries
                                            </Link>
                                            <Link href="/inspiration/blog" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                                Blog
                                            </Link>
                                        </div>
                                    )}
                                </div> */}
                            </nav>
                        )}

                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-6">
                            {/* Wishlist */}
                            <Link href="/wishlist" className="flex flex-col items-center group relative">
                                <Heart className="w-5 h-5 text-gray-700 group-hover:text-red-500 transition" />
                                <span className="text-xs text-gray-600 mt-1">Yêu thích</span>
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                                        {wishlistCount > 99 ? '99+' : wishlistCount}
                                    </span>
                                )}
                            </Link>

                            {/* Cart */}
                            <Link href="/cart" className="flex flex-col items-center group relative">
                                <ShoppingCart className="w-5 h-5 text-gray-700 group-hover:text-blue-600 transition" />
                                <span className="text-xs text-gray-600 mt-1">Giỏ hàng</span>
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                                        {cartCount > 99 ? '99+' : cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* Language/Currency */}
                            <button className="flex flex-col items-center group">
                                <Globe className="w-5 h-5 text-gray-700 group-hover:text-blue-600 transition" />
                                <span className="text-xs text-gray-600 mt-1">EN/VND đ</span>
                            </button>

                            {/* Profile with Dropdown */}
                            <div
                                className="relative"
                                onMouseEnter={() => handleDropdownEnter('profile')}
                                onMouseLeave={handleDropdownLeave}
                            >
                                <button className="flex flex-col items-center group">
                                    <User className="w-5 h-5 text-gray-700 group-hover:text-blue-600 transition" />
                                    <span className="text-xs text-gray-600 mt-1">
                                        {isAuthenticated ? user?.userName : 'Profile'}
                                    </span>
                                </button>

                                {/* Profile Dropdown Menu */}
                                {activeDropdown === 'profile' && (
                                    <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-xl py-4 border border-gray-100">
                                        {/* Header */}
                                        <div className="px-4 pb-3 border-b border-gray-100">
                                            <div className="text-lg font-bold text-gray-900">
                                                {isAuthenticated ? (
                                                    <>
                                                        <h3 className="text-lg font-bold text-gray-900">{user?.userName}</h3>
                                                        <p className="text-sm text-gray-500">{user?.email}</p>
                                                    </>
                                                ) : (
                                                    <h3 className="text-lg font-bold text-gray-900">Profile</h3>
                                                )}
                                            </div>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="py-2">
                                            {isAuthenticated ? (
                                                <>
                                                    {/* My Profile */}
                                                    <Link
                                                        href="/profile"
                                                        className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition group"
                                                    >
                                                        <div className="flex items-center">
                                                            <User className="w-5 h-5 text-gray-600 mr-3" />
                                                            <span className="text-gray-700 font-medium group-hover:text-blue-600">
                                                                My Profile
                                                            </span>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                                    </Link>

                                                    {/* My Bookings */}
                                                    <Link
                                                        href="/bookings"
                                                        className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition group"
                                                    >
                                                        <div className="flex items-center">
                                                            <Calendar className="w-5 h-5 text-gray-600 mr-3" />
                                                            <span className="text-gray-700 font-medium group-hover:text-blue-600">
                                                                My Bookings
                                                            </span>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                                    </Link>

                                                    {/* Updates */}
                                                    <Link
                                                        href="/updates"
                                                        className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition group"
                                                    >
                                                        <div className="flex items-center">
                                                            <Bell className="w-5 h-5 text-gray-600 mr-3" />
                                                            <span className="text-gray-700 font-medium group-hover:text-blue-600">
                                                                Updates
                                                            </span>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                                    </Link>

                                                    {/* Appearance */}
                                                    <Link
                                                        href="/appearance"
                                                        className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition group"
                                                    >
                                                        <div className="flex items-center">
                                                            <Sun className="w-5 h-5 text-gray-600 mr-3" />
                                                            <span className="text-gray-700 font-medium group-hover:text-blue-600">
                                                                Appearance
                                                            </span>
                                                        </div>
                                                        <span className="text-sm text-gray-500">Always light</span>
                                                    </Link>

                                                    {/* Support */}
                                                    <Link
                                                        href="/support"
                                                        className="flex items-center px-4 py-3 hover:bg-gray-50 transition group"
                                                    >
                                                        <HelpCircle className="w-5 h-5 text-gray-600 mr-3" />
                                                        <span className="text-gray-700 font-medium group-hover:text-blue-600">
                                                            Support
                                                        </span>
                                                    </Link>

                                                    {/* Divider */}
                                                    <div className="my-2 border-t border-gray-200"></div>

                                                    {/* Logout */}
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full flex items-center px-4 py-3 hover:bg-red-50 transition group"
                                                    >
                                                        <LogOut className="w-5 h-5 text-red-600 mr-3" />
                                                        <span className="text-red-600 font-medium">
                                                            Log out
                                                        </span>
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    {/* Log in or sign up */}
                                                    <button
                                                        onClick={handleLoginClick}
                                                        className="w-full flex items-center px-4 py-3 hover:bg-gray-50 transition group"
                                                    >
                                                        <User className="w-5 h-5 text-gray-600 mr-3" />
                                                        <span className="text-gray-700 font-medium group-hover:text-blue-600">
                                                            Log in or sign up
                                                        </span>
                                                    </button>

                                                    {/* Updates */}
                                                    <Link
                                                        href="/updates"
                                                        className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition group"
                                                    >
                                                        <div className="flex items-center">
                                                            <Bell className="w-5 h-5 text-gray-600 mr-3" />
                                                            <span className="text-gray-700 font-medium group-hover:text-blue-600">
                                                                Updates
                                                            </span>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                                    </Link>

                                                    {/* Appearance */}
                                                    <Link
                                                        href="/appearance"
                                                        className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition group"
                                                    >
                                                        <div className="flex items-center">
                                                            <Sun className="w-5 h-5 text-gray-600 mr-3" />
                                                            <span className="text-gray-700 font-medium group-hover:text-blue-600">
                                                                Appearance
                                                            </span>
                                                        </div>
                                                        <span className="text-sm text-gray-500">Always light</span>
                                                    </Link>

                                                    {/* Support */}
                                                    <Link
                                                        href="/support"
                                                        className="flex items-center px-4 py-3 hover:bg-gray-50 transition group"
                                                    >
                                                        <HelpCircle className="w-5 h-5 text-gray-600 mr-3" />
                                                        <span className="text-gray-700 font-medium group-hover:text-blue-600">
                                                            Support
                                                        </span>
                                                    </Link>
                                                </>
                                            )}

                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Login Modal */}
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => {
                    setIsLoginModalOpen(false);
                    setLoginModalMode('login');
                    setLoginModalToken('');
                    refreshUser(); // Refresh user state after login
                }}
                initialMode={loginModalMode}
                initialToken={loginModalToken}
            />
        </>
    );
}