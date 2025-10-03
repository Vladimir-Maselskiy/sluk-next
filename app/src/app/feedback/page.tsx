import { Suspense } from 'react';
import FeedbackPageClient from './FeedbackPageClient';

export default function FeedbackPage() {
  return (
    <Suspense fallback={<div>Loading feedback form...</div>}>
      <FeedbackPageClient />
    </Suspense>
  );
}
