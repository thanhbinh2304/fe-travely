import { Suspense } from 'react';
import ToursClient from './ToursClient';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Đang tải...</div>}>
      <ToursClient />
    </Suspense>
  );
}
