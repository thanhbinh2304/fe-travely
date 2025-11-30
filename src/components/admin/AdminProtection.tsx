'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface AdminProtectionProps {
    children: React.ReactNode;
}

export default function AdminProtection({ children }: AdminProtectionProps) {
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();
    const [accessDenied, setAccessDenied] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            // Nếu chưa đăng nhập, redirect về trang chủ
            if (!isAuthenticated) {
                setAccessDenied(true);
                setTimeout(() => router.push('/'), 1500);
                return;
            }

            // Nếu không phải admin (role_id !== 1), redirect về trang chủ
            if (user && user.role_id !== 1) {
                setAccessDenied(true);
                setTimeout(() => router.push('/'), 1500);
                return;
            }
        }
    }, [user, isLoading, isAuthenticated, router]);

    // Hiển thị loading khi đang check authentication
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">Đang xác thực...</p>
                </div>
            </div>
        );
    }

    // Hiển thị thông báo access denied
    if (accessDenied) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-lg">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Truy cập bị từ chối</h3>
                    <p className="text-gray-600 mb-4">Bạn không có quyền truy cập vào trang này. Chỉ admin mới được phép.</p>
                    <p className="text-sm text-gray-500">Đang chuyển hướng về trang chủ...</p>
                </div>
            </div>
        );
    }

    // Chỉ render children nếu user là admin
    if (isAuthenticated && user && user.role_id === 1) {
        return <>{children}</>;
    }

    // Trả về null trong các trường hợp khác
    return null;
}