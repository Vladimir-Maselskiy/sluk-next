'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { CheckoutForm } from '../CheckoutForm/CheckoutForm';
import styles from './payment.module.css';
import { Flex, Spin } from 'antd';

const domain = process.env.NEXT_PUBLIC_BASE_URL;

export const Payment = () => {
  const [isValid, setIsValid] = useState(false);
  const [stripePromise, setStripePromise] =
    useState<Promise<Stripe | null> | null>(null);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentData, setPaymentData] = useState({});
  const [amount, setAmount] = useState<number | null>(null);
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
      const { clientSecret, amount } = await result.json();
      setClientSecret(clientSecret);
      setAmount(amount);
    });
  }, [isValid]);

  return (
    <div>
      <h1 className={styles.title}>Checkout</h1>
      {amount !== null && (
        <div style={{ marginTop: 20 }}>
          <strong>Total:</strong> €{(amount / 100).toFixed(2)} EUR
        </div>
      )}
      {clientSecret && stripePromise && isValid ? (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      ) : (
        <Flex style={{ height: '40vh' }} justify="center" align="center">
          <Spin size="large" />
        </Flex>
      )}
    </div>
  );
};
