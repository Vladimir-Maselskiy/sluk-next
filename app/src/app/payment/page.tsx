import { Suspense } from 'react';
import { Payment } from '../components/Stripe/Payment/Payment';

export default function Home() {
  return (
    <main>
      <Suspense fallback={<div>Loading payment...</div>}>
        <Payment />
      </Suspense>
    </main>
  );
}
