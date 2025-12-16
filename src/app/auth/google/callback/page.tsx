import { Suspense } from 'react';
import GoogleCallbackClient from './GoogleCallbackClient';

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-r-transparent" />
        </div>
      }
    >
      <GoogleCallbackClient />
    </Suspense>
  );
}
