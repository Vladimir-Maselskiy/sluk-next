'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { CheckoutForm } from '../CheckoutForm/CheckoutForm';
import styles from './payment.module.css';
import { Spin } from 'antd';

const domain = process.env.NEXT_PUBLIC_BASE_URL;

export const Payment = () => {
  const [isValid, setIsValid] = useState(false);
  const [stripePromise, setStripePromise] =
    useState<Promise<Stripe | null> | null>(null);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentData, setPaymentData] = useState({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const data = searchParams.get('data');

  useEffect(() => {
    fetch(`${domain}/api/config`).then(async r => {
      const { publishableKey }: { publishableKey: string } = await r.json();
      setStripePromise(loadStripe(publishableKey));
    });
  }, []);

  useEffect(() => {
    console.log('data', data);
    if (!data) {
      router.replace('/failed');
      return;
    }

    try {
      const { cost, userId, duration } = JSON.parse(atob(data));
      console.log('cost', cost, 'userId', userId, 'duration', duration);
      if (!cost || !userId || !duration) {
        router.replace('/failed');
        return;
      }
      setPaymentData({ cost, userId, duration });
      setIsValid(true);
    } catch (err) {
      console.error('something went wrong:', err);
      router.replace('/failed');
    }
  }, [data, router]);

  useEffect(() => {
    if (!isValid) return;
    fetch(`${domain}/api/create-payment-intent`, {
      method: 'POST',
      body: JSON.stringify(paymentData),
    }).then(async result => {
      const { clientSecret } = await result.json();
      setClientSecret(clientSecret);
    });
  }, [isValid]);

  return (
    <div>
      <h1 className={styles.title}>Checkout</h1>
      {clientSecret && stripePromise && isValid ? (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      ) : (
        <Spin size="large" />
      )}
    </div>
  );
};
