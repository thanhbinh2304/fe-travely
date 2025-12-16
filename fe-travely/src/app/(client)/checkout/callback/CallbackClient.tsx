'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2, Home, FileText } from 'lucide-react';
import Link from 'next/link';

const API_URL =
  process.env.NEXT_PUBLIC_SERVER_API || 'http://127.0.0.1:8000/api';

export default function CallbackClient() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>(
    'loading'
  );
  const [message, setMessage] = useState('');

  useEffect(() => {
    const processCallback = async () => {
      const resultCode = searchParams.get('resultCode');
      const messageParam = searchParams.get('message');

      if (resultCode === '0') {
        setStatus('success');
        setMessage('Thanh toán thành công!');

        setTimeout(() => {
          localStorage.removeItem('travely_cart');
          sessionStorage.removeItem('checkout_data');
          window.dispatchEvent(new Event('cart-updated'));
        }, 500);
      } else {
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
          <h2 className="text-xl font-semibold">Đang xử lý thanh toán...</h2>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="p-8 text-center max-w-md w-full">
        {status === 'success' ? (
          <>
            <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              Thanh toán thành công!
            </h2>
            <div className="space-y-3">
              <Link href="/bookings">
                <Button className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Xem đơn hàng
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  <Home className="mr-2 h-4 w-4" />
                  Trang chủ
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Thanh toán thất bại</h2>
            <p className="mb-4">{message}</p>
            <Link href="/checkout">
              <Button className="w-full">Thử lại</Button>
            </Link>
          </>
        )}
      </Card>
    </div>
  );
}
