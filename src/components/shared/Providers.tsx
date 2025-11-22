// components/shared/Providers.tsx
'use client';

import { ReactNode } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import FacebookSDK from './FacebookSDK';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <FacebookSDK />
      {children}
    </GoogleOAuthProvider>
  );
}