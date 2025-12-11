'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar, Users, CreditCard, Building2, ChevronLeft, Loader2 } from 'lucide-react';
import { cartService, CartItem } from '@/app/services/cartService';
import authService from '@/app/services/authService';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_SERVER_API || 'http://127.0.0.1:8000/api';

export default function CheckoutPage() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'momo' | 'vietqr'>('momo');

    // Voucher
    const [voucherCode, setVoucherCode] = useState('');
    const [appliedVoucher, setAppliedVoucher] = useState<{
        promotionID: number;
        code: string;
        discount: number;
        description: string;
    } | null>(null);
    const [voucherLoading, setVoucherLoading] = useState(false);

    // Customer info
    const [customerInfo, setCustomerInfo] = useState({
        fullName: '',
        email: '',
        phone: '',
        notes: ''
    });

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        try {
            setLoading(true);

            // Force sync cart if user is authenticated
            const token = authService.getToken();
            if (token) {
                console.log('User authenticated, syncing cart...');
                await cartService.syncCartToServer();
                // Force clear cache after sync
                await cartService.clearCache();
            }

            const items = await cartService.getCart();
            console.log('Loaded cart items:', items);
            if (items.length === 0) {
                toast.error('Giỏ hàng trống');
                router.push('/cart');
                return;
            }
            setCartItems(items);
        } catch (error) {
            console.error('Failed to load cart:', error);
            toast.error('Không thể tải giỏ hàng');
        } finally {
            setLoading(false);
        }
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((sum, item) => {
            const price = typeof item.discountedPrice === 'number'
                ? item.discountedPrice
                : parseFloat(String(item.discountedPrice)) || 0;
            return sum + price;
        }, 0);
    };

    const calculateDiscount = () => {
        if (!appliedVoucher) return 0;
        const subtotal = calculateSubtotal();
        return (subtotal * appliedVoucher.discount) / 100;
    };

    const calculateTotal = () => {
        return calculateSubtotal() - calculateDiscount();
    };

    const formatPrice = (price: number) => {
        if (isNaN(price)) return '0';
        return new Intl.NumberFormat('vi-VN').format(Math.round(price));
    };

    const applyVoucher = async () => {
        if (!voucherCode.trim()) {
            toast.error('Vui lòng nhập mã voucher');
            return;
        }

        setVoucherLoading(true);
        try {
            const token = authService.getToken();
            if (!token) {
                toast.error('Vui lòng đăng nhập để sử dụng voucher');
                return;
            }

            const response = await fetch(`${API_URL}/promotions/validate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ code: voucherCode })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Mã voucher không hợp lệ');
            }

            setAppliedVoucher({
                promotionID: data.data.promotionID,
                code: voucherCode,
                discount: data.data.discount,
                description: data.data.description
            });
            toast.success(`Áp dụng voucher thành công! Giảm ${data.data.discount}%`);
        } catch (error: any) {
            console.error('Voucher error:', error);
            toast.error(error.message || 'Mã voucher không hợp lệ hoặc đã hết hạn');
        } finally {
            setVoucherLoading(false);
        }
    };

    const removeVoucher = () => {
        setAppliedVoucher(null);
        setVoucherCode('');
        toast.info('Đã xóa mã voucher');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted!', customerInfo);

        // Validate
        if (!customerInfo.fullName.trim()) {
            toast.error('Vui lòng nhập họ tên');
            return;
        }
        if (!customerInfo.email.trim()) {
            toast.error('Vui lòng nhập email');
            return;
        }
        if (!customerInfo.phone.trim()) {
            toast.error('Vui lòng nhập số điện thoại');
            return;
        }

        console.log('Validation passed, setting processing...');
        setProcessing(true);

        try {
            const token = authService.getToken();
            console.log('Token:', token ? 'exists' : 'not found');
            if (!token) {
                toast.error('Vui lòng đăng nhập');
                router.push('/auth/signin');
                return;
            }

            // For each cart item, create payment
            console.log('Cart items:', cartItems);
            let bookingIDs = cartItems
                .filter(item => item.bookingID)
                .map(item => item.bookingID);

            console.log('Booking IDs:', bookingIDs);

            // If no bookingIDs, sync cart to server first
            if (bookingIDs.length === 0) {
                console.log('No booking IDs found, syncing cart to server...');
                toast.info('Đang đồng bộ giỏ hàng...');

                try {
                    await cartService.syncCartToServer();
                    // Reload cart to get bookingIDs
                    const updatedCart = await cartService.getCart();
                    console.log('Updated cart after sync:', updatedCart);

                    bookingIDs = updatedCart
                        .filter(item => item.bookingID)
                        .map(item => item.bookingID);

                    console.log('Updated booking IDs:', bookingIDs);

                    if (bookingIDs.length === 0) {
                        toast.error('Không thể đồng bộ giỏ hàng');
                        return;
                    }

                    // Update cart items state
                    setCartItems(updatedCart);
                } catch (syncError) {
                    console.error('Sync error:', syncError);
                    toast.error('Không thể đồng bộ giỏ hàng');
                    return;
                }
            }

            // Create payment for first booking (or combine them)
            const totalAmount = calculateTotal();
            const firstBookingID = bookingIDs[0];
            console.log('First booking ID:', firstBookingID, 'Total amount:', totalAmount);

            const endpoint = paymentMethod === 'momo'
                ? `${API_URL}/payment/momo/create`
                : `${API_URL}/payment/vietqr/create`;

            console.log('Payment request:', {
                endpoint,
                paymentMethod,
                bookingID: firstBookingID,
                amount: totalAmount
            });

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    bookingID: firstBookingID,
                    amount: totalAmount,
                    orderInfo: `Thanh toán ${cartItems.length} tour - ${customerInfo.fullName}`,
                    customerName: customerInfo.fullName,
                    customerEmail: customerInfo.email,
                    customerPhone: customerInfo.phone,
                    notes: customerInfo.notes,
                    promotionID: appliedVoucher?.promotionID
                })
            });

            console.log('Payment response status:', response.status);
            const data = await response.json();
            console.log('Payment response data:', data);

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Payment creation failed');
            }

            // Handle payment method specific response
            if (paymentMethod === 'momo') {
                // Redirect to MoMo payment page
                console.log('MoMo payUrl:', data.data?.payUrl);
                if (data.data?.payUrl) {
                    // Store checkout info for callback
                    const checkoutData = {
                        checkoutID: data.data.checkoutID,
                        orderId: data.data.orderId,
                        amount: totalAmount
                    };
                    sessionStorage.setItem('checkout_data', JSON.stringify(checkoutData));
                    console.log('Redirecting to MoMo...');
                    window.location.href = data.data.payUrl;
                } else {
                    console.error('No payUrl in response:', data);
                    throw new Error('No payment URL received');
                }
            } else if (paymentMethod === 'vietqr') {
                // Show QR code
                console.log('VietQR response:', data.data);
                const qrUrl = data.data?.qrImageUrl || data.data?.qrCodeUrl;
                console.log('VietQR URL:', qrUrl);

                if (qrUrl) {
                    // Store checkout info and redirect to QR page
                    const checkoutData = {
                        checkoutID: data.data.checkoutID,
                        qrCodeUrl: qrUrl,
                        amount: totalAmount,
                        orderId: data.data.orderId
                    };
                    console.log('Storing checkout data:', checkoutData);
                    sessionStorage.setItem('checkout_data', JSON.stringify(checkoutData));
                    console.log('Redirecting to VietQR page...');
                    router.push('/checkout/vietqr');
                } else {
                    console.error('No qrImageUrl or qrCodeUrl in response:', data);
                    throw new Error('No QR code received');
                }
            }
        } catch (error: any) {
            console.error('Checkout error:', error);
            toast.error(error.message || 'Thanh toán thất bại');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-6">
                    <Link href="/cart" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
                        <ChevronLeft className="h-5 w-5" />
                        <span>Quay lại giỏ hàng</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Thanh toán</h1>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left column - Customer info & Payment method */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Customer Information */}
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin khách hàng</h2>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="fullName">Họ và tên *</Label>
                                        <Input
                                            id="fullName"
                                            type="text"
                                            value={customerInfo.fullName}
                                            onChange={(e) => setCustomerInfo({ ...customerInfo, fullName: e.target.value })}
                                            placeholder="Nguyễn Văn A"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={customerInfo.email}
                                            onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                                            placeholder="email@example.com"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone">Số điện thoại *</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={customerInfo.phone}
                                            onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                                            placeholder="0901234567"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="notes">Ghi chú</Label>
                                        <Textarea
                                            id="notes"
                                            value={customerInfo.notes}
                                            onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                                            placeholder="Yêu cầu đặc biệt..."
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            </Card>

                            {/* Payment Method */}
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Phương thức thanh toán</h2>
                                <RadioGroup value={paymentMethod} onValueChange={(value: string) => setPaymentMethod(value as 'momo' | 'vietqr')}>
                                    <div className="space-y-3">
                                        {/* MoMo */}
                                        <div className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                            <RadioGroupItem value="momo" id="momo" />
                                            <label htmlFor="momo" className="flex items-center gap-3 flex-1 cursor-pointer">
                                                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                                                    <CreditCard className="h-6 w-6 text-pink-600" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">Ví MoMo</p>
                                                    <p className="text-sm text-gray-500">Thanh toán qua ví điện tử MoMo</p>
                                                </div>
                                            </label>
                                        </div>

                                        {/* VietQR */}
                                        <div className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                            <RadioGroupItem value="vietqr" id="vietqr" />
                                            <label htmlFor="vietqr" className="flex items-center gap-3 flex-1 cursor-pointer">
                                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <Building2 className="h-6 w-6 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">Chuyển khoản ngân hàng (VietQR)</p>
                                                    <p className="text-sm text-gray-500">Quét mã QR để chuyển khoản</p>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </RadioGroup>
                            </Card>
                        </div>

                        {/* Right column - Order summary */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-6">
                                <Card className="p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Đơn hàng của bạn</h2>

                                    {/* Cart items */}
                                    <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                                        {cartItems.map((item) => (
                                            <div key={item.bookingID || item.tourID} className="flex gap-3">
                                                <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-200">
                                                    {item.imageUrl && (
                                                        <Image
                                                            src={item.imageUrl}
                                                            alt={item.title}
                                                            fill
                                                            className="object-cover"
                                                            unoptimized
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                                                        {item.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>{item.date}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                                        <Users className="h-3 w-3" />
                                                        <span>{item.adults} người lớn</span>
                                                    </div>
                                                    <p className="text-sm font-semibold text-red-600 mt-1">
                                                        ₫{formatPrice(item.discountedPrice)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Voucher section */}
                                    <div className="border-t pt-4">
                                        <Label className="text-sm font-semibold mb-2 block">Mã giảm giá</Label>
                                        {appliedVoucher ? (
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-semibold text-green-700">{appliedVoucher.code}</p>
                                                        <p className="text-xs text-green-600">{appliedVoucher.description}</p>
                                                        <p className="text-sm font-medium text-green-700 mt-1">Giảm {appliedVoucher.discount}%</p>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={removeVoucher}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        Xóa
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex gap-2">
                                                <Input
                                                    type="text"
                                                    value={voucherCode}
                                                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                                                    placeholder="Nhập mã voucher"
                                                    className="flex-1"
                                                    disabled={voucherLoading}
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={applyVoucher}
                                                    disabled={voucherLoading || !voucherCode.trim()}
                                                    className="bg-blue-600 hover:bg-blue-700"
                                                >
                                                    {voucherLoading ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        'Áp dụng'
                                                    )}
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="border-t pt-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Tạm tính</span>
                                            <span className="font-medium">₫{formatPrice(calculateSubtotal())}</span>
                                        </div>
                                        {appliedVoucher && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-green-600">Giảm giá ({appliedVoucher.discount}%)</span>
                                                <span className="font-medium text-green-600">-₫{formatPrice(calculateDiscount())}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Phí dịch vụ</span>
                                            <span className="font-medium">₫0</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-bold pt-2 border-t">
                                            <span>Tổng cộng</span>
                                            <span className="text-red-600">₫{formatPrice(calculateTotal())}</span>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold"
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                                Đang xử lý...
                                            </>
                                        ) : (
                                            'Thanh toán ngay'
                                        )}
                                    </Button>

                                    <p className="text-xs text-gray-500 text-center mt-4">
                                        Bằng việc tiếp tục, bạn đồng ý với các điều khoản và điều kiện của chúng tôi
                                    </p>
                                </Card>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
