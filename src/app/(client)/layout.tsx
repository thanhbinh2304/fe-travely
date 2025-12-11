'use client';

import { useEffect } from 'react';
import HeaderClient from "@/components/client/header";
import FooterClient from "@/components/client/footer";
import { cartService } from '@/app/services/cartService';
import authService from '@/app/services/authService';
export default function ClientLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Sync cart on mount if user is authenticated
    useEffect(() => {
        if (authService.isAuthenticated()) {
            cartService.syncCartToServer().catch(err =>
                console.error('[ClientLayout] Cart sync failed:', err)
            );
        }
    }, []);

    // Layout cho client - có Header/Footer
    return (
        <>
            <HeaderClient />
            {children}
            <FooterClient />
        </>
    );
}
