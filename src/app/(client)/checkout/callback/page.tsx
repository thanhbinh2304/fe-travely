'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2, Home, FileText } from 'lucide-react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_SERVER_API || 'http://127.0.0.1:8000/api';

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const processCallback = async () => {
            // Get parameters from URL
            const resultCode = searchParams.get('resultCode');
            const orderId = searchParams.get('orderId');
            const transId = searchParams.get('transId');
            const messageParam = searchParams.get('message');

            console.log('[MoMo Callback]', { resultCode, orderId, transId, messageParam });

            // If payment failed/cancelled, call backend to update status
            if (resultCode && resultCode !== '0') {
                try {
                    const token = localStorage.getItem('access_token') || document.cookie
                        .split('; ')
                        .find(row => row.startsWith('access_token='))
                        ?.split('=')[1];

                    // Try to get checkoutID from sessionStorage
                    const checkoutDataStr = sessionStorage.getItem('checkout_data');
                    if (token && checkoutDataStr) {
                        try {
                            const checkoutData = JSON.parse(checkoutDataStr);
                            const checkoutID = checkoutData.checkoutID;
                            
                            if (checkoutID) {
                                // Cancel the payment
                                const cancelResponse = await fetch(`${API_URL}/payment/cancel`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${token}`,
                                        'Accept': 'application/json'
                                    },
                                    body: JSON.stringify({ checkoutID })
                                });
                                
                                if (cancelResponse.ok) {
                                    console.log('[MoMo] Payment cancelled successfully');
                                    // Clear checkout data
                                    sessionStorage.removeItem('checkout_data');
                                } else {
                                    console.warn('[MoMo] Failed to cancel payment:', await cancelResponse.text());
                                }
                            }
                        } catch (parseError) {
                            console.error('[MoMo] Failed to parse checkout data:', parseError);
                        }
                    }
                } catch (error) {
                    console.error('[MoMo] Failed to cancel payment:', error);
                }
            }

            // Check result code
            if (resultCode === '0') {
                // Success
                setStatus('success');
                setMessage('Thanh toán thành công!');

                // Clear cart and checkout data after successful payment
                setTimeout(() => {
                    localStorage.removeItem('travely_cart');
                    sessionStorage.removeItem('checkout_data');
                    window.dispatchEvent(new Event('cart-updated'));
                }, 1000);
            } else {
                // Failed
                setStatus('failed');
                setMessage(messageParam || 'Thanh toán thất bại');
            }
        };

        processCallback();
    }, [searchParams]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Card className="p-8 text-center max-w-md">
                    <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Đang xử lý thanh toán...</h2>
                    <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="p-8 text-center max-w-md w-full">
                {status === 'success' ? (
                    <>
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="h-10 w-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán thành công!</h2>
                        <p className="text-gray-600 mb-6">
                            Đơn hàng của bạn đã được thanh toán thành công. Chúng tôi đã gửi email xác nhận đến bạn.
                        </p>
                        <div className="space-y-3">
                            <Link href="/bookings" className="block">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Xem đơn hàng của tôi
                                </Button>
                            </Link>
                            <Link href="/" className="block">
                                <Button variant="outline" className="w-full">
                                    <Home className="h-4 w-4 mr-2" />
                                    Về trang chủ
                                </Button>
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <XCircle className="h-10 w-10 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán thất bại</h2>
                        <p className="text-gray-600 mb-6">{message}</p>
                        <div className="space-y-3">
                            <Link href="/checkout" className="block">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                    Thử lại
                                </Button>
                            </Link>
                            <Link href="/cart" className="block">
                                <Button variant="outline" className="w-full">
                                    Quay lại giỏ hàng
                                </Button>
                            </Link>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
}

export default function MoMoCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Card className="p-8 text-center max-w-md">
                    <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Đang tải...</h2>
                </Card>
            </div>
        }>
            <CallbackContent />
        </Suspense>
    );
}
