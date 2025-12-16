export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import VietQRPaymentPage from './VietQRPaymentPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VietQRPaymentPage />
    </Suspense>
  );
}
