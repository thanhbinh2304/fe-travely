export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import BookingsClient from './BookingsClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingsClient />
    </Suspense>
  );
}
