export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import CallbackClient from './CallbackClient';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="p-8 text-center max-w-md">
            <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold">Đang tải...</h2>
          </Card>
        </div>
      }
    >
      <CallbackClient />
    </Suspense>
  );
}
