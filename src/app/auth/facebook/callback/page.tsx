'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import authApi from '@/app/services/authService';

export default function FacebookCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Get Facebook data from URL params
                const code = searchParams.get('code');
                const state = searchParams.get('state');
                const error = searchParams.get('error');
                const errorDescription = searchParams.get('error_description');

                // Check for errors
                if (error) {
                    console.error('Facebook auth error:', error, errorDescription);
                    router.push('/?error=facebook_auth_failed');
                    return;
                }

                // Check if we have a code
                if (!code) {
                    console.error('No authorization code received');
                    router.push('/?error=no_code');
                    return;
                }

                // Send code to backend
                const response = await fetch(`${process.env.SERVER_API || 'http://localhost:8000/api'}/auth/facebook/callback`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code, state }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.msg || 'Facebook login failed');
                }

                // Save token and user
                if (data.data?.access_token) {
                    localStorage.setItem('access_token', data.data.access_token);
                    localStorage.setItem('user', JSON.stringify(data.data.user));
                }

                // Redirect to home
                router.push('/?login=success');

            } catch (error) {
                console.error('Facebook callback error:', error);
                router.push('/?error=callback_failed');
            }
        };

        handleCallback();
    }, [router, searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Completing Facebook Login...
                </h2>
                <p className="text-gray-600">
                    Please wait while we authenticate your account.
                </p>
            </div>
        </div>
    );
}
