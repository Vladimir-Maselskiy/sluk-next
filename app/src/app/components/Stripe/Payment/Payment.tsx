'use client';
import { useEffect, useState } from 'react';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { CheckoutForm } from '../CheckoutForm/CheckoutForm';
import styles from './payment.module.css';

const domain = process.env.NEXT_PUBLIC_BASE_URL;

export const Payment = () => {
  const [stripePromise, setStripePromise] =
    useState<Promise<Stripe | null> | null>(null);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    fetch(`${domain}/api/config`).then(async r => {
      const { publishableKey }: { publishableKey: string } = await r.json();
      setStripePromise(loadStripe(publishableKey));
    });
  }, []);

  useEffect(() => {
    fetch(`${domain}/api/create-payment-intent`, {
      method: 'POST',
      body: JSON.stringify({}),
    }).then(async result => {
      const { clientSecret } = await result.json();
      setClientSecret(clientSecret);
    });
  }, []);
  // useEffect(() => {
  //   fetch(`${domain}/create-checkout-session`, {
  //     method: 'POST',
  //     body: JSON.stringify({}),
  //   }).then(async result => {
  //     let { clientSecret } = await result.json();
  //     setClientSecret(clientSecret);
  //   });
  // }, []);

  return (
    <div>
      <h1 className={styles.title}>Checkout</h1>
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
};
