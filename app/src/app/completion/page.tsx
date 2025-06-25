import { Suspense } from 'react';
import CompletionPageClient from './CompletionPageClient';

export default function CompletionPage() {
  return (
    <Suspense fallback={<div>Loading payment result...</div>}>
      <CompletionPageClient />
    </Suspense>
  );
}
