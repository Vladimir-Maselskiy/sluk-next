import Image from 'next/image';
import { Payment } from './components/Stripe/Payment/Payment';

export default function Home() {
  return (
    <main>
      <Payment />
    </main>
  );
}
