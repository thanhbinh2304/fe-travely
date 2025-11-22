'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Globe, User, ChevronDown, LogIn, Bell, Sun, HelpCircle, ChevronRight, Calendar, LogOut } from 'lucide-react';
import { useScrollSearch } from '@/hooks/useScrollSearch';
import SearchBar from './SearchBar';
import {useAuth} from '@/hooks/useAuth';
import { LoginModal } from '@/components/client/login';

type DropdownType = 'places' | 'things' | 'trip' | 'profile' | null;

export default function HeaderClient() {
    const [scrolled, setScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const { showSearchInHeader } = useScrollSearch();
    const { user, isAuthenticated, logout } = useAuth();

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
                                <span className="block leading-tight">GET</span>
                                <span className="block leading-tight">YOUR</span>
                                <span className="block leading-tight">GUIDE</span>
                            </div>
                        </Link>

                        {/* Search Bar in Header (appears when scrolled past banner) */}
                        {showSearchInHeader && (
                            <div className="flex-1 max-w-2xl mx-8">
                                <SearchBar className="scale-90" />
                            </div>
                        )}

                        {/* Navigation Menu */}
                        {!showSearchInHeader && (
                            <nav className="hidden md:flex items-center space-x-8">
                                {/* Places to see */}
                                <div
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
                                </div>

                                {/* Things to do */}
                                <div
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
                                </div>

                                {/* Trip inspiration */}
                                <div
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
                                </div>
                            </nav>
                        )}

                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-6">
                            {/* Wishlist */}
                            <Link href="/wishlist" className="flex flex-col items-center group">
                                <Heart className="w-5 h-5 text-gray-700 group-hover:text-red-500 transition" />
                                <span className="text-xs text-gray-600 mt-1">Wishlist</span>
                            </Link>

                            {/* Cart */}
                            <Link href="/cart" className="flex flex-col items-center group relative">
                                <ShoppingCart className="w-5 h-5 text-gray-700 group-hover:text-blue-600 transition" />
                                <span className="text-xs text-gray-600 mt-1">Cart</span>
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                    0
                                </span>
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
                onClose={() => setIsLoginModalOpen(false)} 
            />
        </>
    );
}