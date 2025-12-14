'use client';

import { useState, useEffect } from 'react';
import { Calendar, Users, Globe, CheckCircle2, Edit, Trash2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { cartService, CartItem } from '@/app/services/cartService';
import { LoginModal } from '@/components/client/login';
import authService from '@/app/services/AuthService';

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    useEffect(() => {
        // Check authentication
        setIsAuthenticated(authService.isAuthenticated());

        // Load cart from service
        loadCart();

        // Listen for cart updates
        const handleCartUpdate = () => {
            loadCart();
            setIsAuthenticated(authService.isAuthenticated());
        };

        // Listen for storage changes (when user logs in/out)
        const handleStorageChange = () => {
            setIsAuthenticated(authService.isAuthenticated());
            loadCart();
        };

        // Listen for auth changes
        const handleAuthChange = () => {
            setIsAuthenticated(authService.isAuthenticated());
            loadCart();
        };

        window.addEventListener('cart-updated', handleCartUpdate);
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('auth-changed', handleAuthChange);

        return () => {
            window.removeEventListener('cart-updated', handleCartUpdate);
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('auth-changed', handleAuthChange);
        };
    }, []);

    const loadCart = async () => {
        try {
            const items = await cartService.getCart();
            setCartItems(items);
        } catch (error) {
            console.error('Failed to load cart:', error);
        }
    };

    const handleRemoveItem = async (bookingIDOrTourID: number | string) => {
        try {
            await cartService.removeFromCart(bookingIDOrTourID);
            await loadCart(); // Reload cart after removal
        } catch (error) {
            console.error('Failed to remove item:', error);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price);
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((sum, item) => sum + item.discountedPrice, 0);
    };

    const calculateOriginalTotal = () => {
        return cartItems.reduce((sum, item) => sum + (item.originalPrice || item.discountedPrice), 0);
    };

    const groupItemsByDate = () => {
        const grouped: { [key: string]: CartItem[] } = {};
        cartItems.forEach(item => {
            if (!grouped[item.date]) {
                grouped[item.date] = [];
            }
            grouped[item.date].push(item);
        });
        return grouped;
    };

    const groupedItems = groupItemsByDate();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Giỏ hàng</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left column - Cart items */}
                    <div className="lg:col-span-2 space-y-6">
                        {cartItems.length === 0 ? (
                            <Card className="p-12 text-center">
                                <p className="text-gray-500 mb-4">Giỏ hàng của bạn đang trống</p>
                                <Link href="/tours">
                                    <Button>Khám phá các tour</Button>
                                </Link>
                            </Card>
                        ) : (
                            <>
                                {Object.entries(groupedItems).map(([date, items]) => (
                                    <div key={date} className="space-y-4">
                                        <h2 className="text-lg font-semibold text-gray-900">{date}</h2>
                                        {items.map((item) => (
                                            <Card key={item.bookingID || item.tourID} className="p-6">
                                                <div className="flex gap-4">
                                                    {/* Tour image */}
                                                    <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                                                        {item.imageUrl ? (
                                                            <Image
                                                                src={item.imageUrl}
                                                                alt={item.title}
                                                                fill
                                                                className="object-cover"
                                                                unoptimized
                                                                onError={(e) => {
                                                                    console.error('[Cart] Image failed to load:', item.imageUrl);
                                                                    const target = e.target as HTMLImageElement;
                                                                    target.style.display = 'none';
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                No image
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Tour details */}
                                                    <div className="flex-1 min-w-0">
                                                        <Link href={`/tours/${item.tourID}`}>
                                                            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 mb-2 line-clamp-2">
                                                                {item.title}
                                                            </h3>
                                                        </Link>

                                                        <div className="flex items-center gap-2 mb-3">
                                                            <div className="flex items-center">
                                                                <span className="text-yellow-500">★</span>
                                                                <span className="ml-1 text-sm font-medium">{item.rating}</span>
                                                            </div>
                                                            <span className="text-sm text-gray-500">({item.reviewCount.toLocaleString()})</span>
                                                        </div>

                                                        <div className="space-y-2 text-sm text-gray-600">
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="h-4 w-4" />
                                                                <span>{item.date} · {item.time}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Users className="h-4 w-4" />
                                                                <span>{item.adults} người lớn</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Globe className="h-4 w-4" />
                                                                <span>Ngôn ngữ: {item.language}</span>
                                                            </div>
                                                            {item.freeCancellation && (
                                                                <div className="flex items-center gap-2 text-green-600">
                                                                    <CheckCircle2 className="h-4 w-4" />
                                                                    <span>Hủy miễn phí</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex items-center gap-3 mt-4">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="gap-2"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                                Chỉnh sửa
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                onClick={() => handleRemoveItem(item.bookingID || item.tourID)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    {/* Price */}
                                                    <div className="text-right flex-shrink-0">
                                                        {item.originalPrice > 0 && (
                                                            <p className="text-sm text-gray-500 line-through">
                                                                ₫{formatPrice(item.originalPrice)}
                                                            </p>
                                                        )}
                                                        <p className="text-xl font-bold text-red-600">
                                                            ₫{formatPrice(item.discountedPrice)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                ))}
                            </>
                        )}
                    </div>

                    {/* Right column - Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6">
                            <Card className="p-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">Tổng phụ</h3>
                                            <p className="text-sm text-gray-500">({cartItems.length} tour)</p>
                                        </div>
                                        <div className="text-right">
                                            {calculateOriginalTotal() > calculateSubtotal() && (
                                                <p className="text-sm text-gray-500 line-through">
                                                    ₫{formatPrice(calculateOriginalTotal())}
                                                </p>
                                            )}
                                            <p className="text-xl font-bold text-red-600">
                                                ₫{formatPrice(calculateSubtotal())}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-xs text-gray-500">
                                        Đã bao gồm tất cả các loại thuế và phí
                                    </p>

                                    {isAuthenticated ? (
                                        <Link href="/checkout">
                                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold">
                                                Tiến hành thanh toán
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Button
                                            onClick={() => setIsLoginModalOpen(true)}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold"
                                        >
                                            Đăng nhập để thanh toán
                                        </Button>
                                    )}

                                    <div className="flex items-center gap-2 text-green-600 text-sm mt-4">
                                        <CheckCircle2 className="h-4 w-4" />
                                        <span>Hủy miễn phí</span>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t space-y-3">
                                    <h4 className="font-semibold text-gray-900">Tại sao đặt với chúng tôi?</h4>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Lock className="h-4 w-4" />
                                            <span>Thanh toán an toàn</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4" />
                                            <span>Không có chi phí ẩn</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Globe className="h-4 w-4" />
                                            <span>Hỗ trợ khách hàng 24/7 trên toàn thế giới</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Total at bottom */}
                            <Card className="p-4 mt-4 bg-gray-50">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-500">Tổng cộng</p>
                                        {calculateOriginalTotal() > calculateSubtotal() && (
                                            <p className="text-sm text-gray-400 line-through">
                                                ₫{formatPrice(calculateOriginalTotal())}
                                            </p>
                                        )}
                                    </div>
                                    <p className="text-2xl font-bold text-red-600">
                                        ₫{formatPrice(calculateSubtotal())}
                                    </p>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Login Modal */}
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => {
                    setIsLoginModalOpen(false);
                    // Force reload authentication state and cart after modal closes
                    setTimeout(() => {
                        setIsAuthenticated(authService.isAuthenticated());
                        loadCart();
                        // Dispatch event to update other components
                        window.dispatchEvent(new Event('auth-changed'));
                    }, 100);
                }}
            />
        </div>
    );
}
