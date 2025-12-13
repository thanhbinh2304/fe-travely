'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import authService from '@/app/services/authServiceProvider';

const API_URL = process.env.NEXT_PUBLIC_SERVER_API || 'http://127.0.0.1:8000/api';

function GoogleCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleCallback = async () => {
            const code = searchParams.get('code');
            const errorParam = searchParams.get('error');

            // User cancelled OAuth
            if (errorParam) {
                setError('Google login was cancelled');
                setLoading(false);
                setTimeout(() => router.push('/'), 2000);
                return;
            }

            // No code received
            if (!code) {
                setError('Invalid callback - no authorization code');
                setLoading(false);
                setTimeout(() => router.push('/'), 2000);
                return;
            }

            try {
                // Send code to backend
                const response = await fetch(`${API_URL}/auth/google/callback`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code }),
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    // Save tokens and user
                    authService.saveToken(data.data.access_token);
                    if (data.data.refresh_token) {
                        authService.saveRefreshToken(data.data.refresh_token);
                    }
                    authService.saveUser(data.data.user);

                    // Redirect based on user role
                    if (data.data.user.role_id === 1) {
                        router.push('/dashboard');
                    } else {
                        router.push('/');
                    }
                } else {
                    setError(data.message || 'Google authentication failed');
                    setLoading(false);
                    setTimeout(() => router.push('/'), 3000);
                }
            } catch (error) {
                console.error('Google callback error:', error);
                setError('Network error during authentication');
                setLoading(false);
                setTimeout(() => router.push('/'), 3000);
            }
        };

        handleCallback();
    }, [searchParams, router]);

    if (loading && !error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Authenticating with Google...</h2>
                    <p className="text-gray-600">Please wait while we complete your login</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Failed</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <p className="text-sm text-gray-500">Redirecting to home page...</p>
                </div>
            </div>
        );
    }

    return null;
}

export default function GoogleCallbackPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                </div>
            </div>
        }>
            <GoogleCallbackContent />
        </Suspense>
    );
}
