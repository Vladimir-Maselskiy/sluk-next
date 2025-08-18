'use client';
import { useSearchParams } from 'next/navigation';

export default function GoogleAuthResult() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  return <div style={{ textTransform: 'capitalize' }}>{status}</div>;
}
