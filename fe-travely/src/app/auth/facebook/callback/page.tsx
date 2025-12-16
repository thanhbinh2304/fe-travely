import { Suspense } from 'react';
import FacebookCallbackClient from './FacebookCallbackClient';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <FacebookCallbackClient />
    </Suspense>
  );
}
