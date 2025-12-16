import { Suspense } from 'react';
import VerifyEmailClient from './VerifyEmailClient';

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-r-transparent" />
        </div>
      }
    >
      <VerifyEmailClient />
    </Suspense>
  );
}
