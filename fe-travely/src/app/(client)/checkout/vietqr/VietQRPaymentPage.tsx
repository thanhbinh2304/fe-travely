'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, CheckCircle2, Loader2, Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_SERVER_API || 'https://backend-travely.onrender.com/api';

export default function VietQRPaymentPage() {
    const router = useRouter();
    const [checkoutData, setCheckoutData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [countdown, setCountdown] = useState(15 * 60); // 15 minutes

    useEffect(() => {
        // Load checkout data from sessionStorage
        const data = sessionStorage.getItem('checkout_data');
        if (!data) {
            toast.error('Không tìm thấy thông tin thanh toán');
            router.push('/cart');
            return;
        }

        try {
            const parsed = JSON.parse(data);
            setCheckoutData(parsed);
            setLoading(false);
        } catch (error) {
            console.error('Failed to parse checkout data:', error);
            toast.error('Dữ liệu thanh toán không hợp lệ');
            router.push('/cart');
        }
    }, [router]);

    // Countdown timer
    useEffect(() => {
        if (countdown <= 0) return;

        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price);
    };

    const getToken = () => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('token') || document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1] || null;
    };

    const handleCopyOrderId = () => {
        if (checkoutData?.orderId) {
            navigator.clipboard.writeText(checkoutData.orderId);
            toast.success('Đã copy mã đơn hàng');
        }
    };

    const handleVerifyPayment = async () => {
        setVerifying(true);
        try {
            const token = getToken();
            if (!token) {
                toast.error('Vui lòng đăng nhập');
                router.push('/?login=true');
                return;
            }

            const response = await fetch(`${API_URL}/payment/vietqr/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    checkoutID: checkoutData.checkoutID,
                    orderId: checkoutData.orderId
                })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Verification failed');
            }

            if (data.data?.status === 'completed') {
                toast.success('Thanh toán thành công!');
                sessionStorage.removeItem('checkout_data');
                router.push('/bookings?payment=success');
            } else {
                toast.info('Chưa nhận được thanh toán. Vui lòng thử lại sau.');
            }
        } catch (error: any) {
            console.error('Verify payment error:', error);
            toast.error(error.message || 'Không thể xác minh thanh toán');
        } finally {
            setVerifying(false);
        }
    };

    const handleCancelPayment = async () => {
        if (!confirm('Bạn có chắc muốn hủy thanh toán này?')) {
            return;
        }

        setCancelling(true);
        try {
            const token = getToken();
            if (!token) {
                toast.error('Vui lòng đăng nhập');
                router.push('/?login=true');
                return;
            }

            const response = await fetch(`${API_URL}/payment/cancel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    checkoutID: checkoutData.checkoutID
                })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Không thể hủy thanh toán');
            }

            toast.success('Đã hủy thanh toán');
            sessionStorage.removeItem('checkout_data');
            router.push('/cart');
        } catch (error: any) {
            console.error('Cancel payment error:', error);
            toast.error(error.message || 'Không thể hủy thanh toán');
        } finally {
            setCancelling(false);
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
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-6">
                    <Link href="/checkout" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
                        <ChevronLeft className="h-5 w-5" />
                        <span>Quay lại</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Thanh toán bằng VietQR</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left - QR Code */}
                    <Card className="p-6">
                        <div className="text-center">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Quét mã QR để thanh toán</h2>
                            <p className="text-sm text-gray-600 mb-6">
                                Sử dụng ứng dụng ngân hàng của bạn để quét mã QR
                            </p>

                            {/* QR Code */}
                            <div className="relative w-full max-w-sm mx-auto aspect-square bg-white rounded-lg shadow-lg p-4 mb-6">
                                {checkoutData?.qrCodeUrl ? (
                                    <Image
                                        src={checkoutData.qrCodeUrl}
                                        alt="VietQR Code"
                                        fill
                                        className="object-contain p-4"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        No QR Code
                                    </div>
                                )}
                            </div>

                            {/* Timer */}
                            <div className="mb-4">
                                {countdown > 0 ? (
                                    <p className="text-sm text-gray-600">
                                        Mã QR sẽ hết hạn sau: <span className="font-semibold text-orange-600">{formatTime(countdown)}</span>
                                    </p>
                                ) : (
                                    <p className="text-sm text-red-600 font-semibold">
                                        Mã QR đã hết hạn
                                    </p>
                                )}
                            </div>

                            {/* Verify button */}
                            <Button
                                onClick={handleVerifyPayment}
                                disabled={verifying || countdown <= 0 || cancelling}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold mb-3"
                            >
                                {verifying ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                        Đang kiểm tra...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="h-5 w-5 mr-2" />
                                        Tôi đã thanh toán
                                    </>
                                )}
                            </Button>

                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    onClick={() => window.location.reload()}
                                    variant="outline"
                                    disabled={cancelling}
                                    className="w-full"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Làm mới
                                </Button>

                                <Button
                                    onClick={handleCancelPayment}
                                    variant="outline"
                                    disabled={verifying || cancelling}
                                    className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                                >
                                    {cancelling ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            Đang hủy...
                                        </>
                                    ) : (
                                        'Hủy thanh toán'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Right - Payment Info */}
                    <div className="space-y-6">
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin thanh toán</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Số tiền:</span>
                                    <span className="font-semibold text-red-600">₫{formatPrice(checkoutData?.amount || 0)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Mã đơn hàng:</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-sm">{checkoutData?.orderId}</span>
                                        <button
                                            onClick={handleCopyOrderId}
                                            className="p-1 hover:bg-gray-100 rounded"
                                            title="Copy mã đơn hàng"
                                        >
                                            <Copy className="h-4 w-4 text-gray-500" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-blue-50 border-blue-200">
                            <h3 className="text-lg font-semibold text-blue-900 mb-3">Hướng dẫn thanh toán</h3>
                            <ol className="space-y-2 text-sm text-blue-800">
                                <li className="flex gap-2">
                                    <span className="font-semibold">1.</span>
                                    <span>Mở ứng dụng ngân hàng trên điện thoại của bạn</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="font-semibold">2.</span>
                                    <span>Chọn tính năng quét mã QR</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="font-semibold">3.</span>
                                    <span>Quét mã QR bên trái</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="font-semibold">4.</span>
                                    <span>Kiểm tra thông tin và xác nhận thanh toán</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="font-semibold">5.</span>
                                    <span>Nhấn nút "Tôi đã thanh toán" để hoàn tất</span>
                                </li>
                            </ol>
                        </Card>

                        <Card className="p-6 bg-yellow-50 border-yellow-200">
                            <h3 className="text-lg font-semibold text-yellow-900 mb-2">⚠️ Lưu ý quan trọng</h3>
                            <ul className="space-y-1 text-sm text-yellow-800">
                                <li>• Vui lòng chuyển khoản đúng số tiền hiển thị</li>
                                <li>• Không chỉnh sửa nội dung chuyển khoản</li>
                                <li>• Thanh toán sẽ được xác nhận trong vòng 5-10 phút</li>
                                <li>• Nếu có vấn đề, vui lòng liên hệ: 1900-xxxx</li>
                            </ul>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
