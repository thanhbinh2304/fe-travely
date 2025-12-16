'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
  onVerifiedLogin: () => void;
  onResetPassword: (token: string) => void;
}

export default function HeaderQueryHandler({
  onVerifiedLogin,
  onResetPassword,
}: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const verified = searchParams.get('verified');
    const reset = searchParams.get('reset');
    const token = searchParams.get('token');

    if (verified === 'true') {
      onVerifiedLogin();
      setTimeout(() => router.replace('/'), 100);
    }

    if (reset === 'true') {
      onResetPassword(token || '');
      setTimeout(() => router.replace('/'), 100);
    }
  }, [searchParams, router, onVerifiedLogin, onResetPassword]);

  return null;
}
