'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function GoogleAuthResult() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  return <div style={{ textTransform: 'capitalize' }}>{status}</div>;
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GoogleAuthResult />
    </Suspense>
  );
}
