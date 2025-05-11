import Image from 'next/image';
import styles from './page.module.css';
import { Payment } from './components/Stripe/Payment';

export default function Home() {
  return (
    <main className={styles.main}>
      <Payment />
    </main>
  );
}
