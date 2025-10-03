import { Suspense } from 'react';
import ResetPasswordPageClient from './ResetPasswordPageClient';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading reset form...</div>}>
      <ResetPasswordPageClient />
    </Suspense>
  );
}
