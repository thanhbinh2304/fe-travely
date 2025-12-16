'use client';

import { useEffect } from 'react';
import { cartService } from '@/app/services/cartService';
import authService from '@/app/services/AuthService';

export default function ClientSideEffects() {
  useEffect(() => {
    if (authService.isAuthenticated()) {
      cartService.syncCartToServer().catch(err =>
        console.error('[ClientSideEffects] Cart sync failed:', err)
      );
    }
  }, []);

  return null;
}
