'use client';
import { useEffect, useState } from 'react';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { CheckoutForm } from './CheckoutForm';

const domain = 'http://localhost:3001/api';

export const Payment = () => {
  const [stripePromise, setStripePromise] =
    useState<Promise<Stripe | null> | null>(null);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    fetch(`${domain}/config`).then(async r => {
      const { publishableKey }: { publishableKey: string } = await r.json();
      setStripePromise(loadStripe(publishableKey));
    });
  }, []);

  useEffect(() => {
    fetch(`${domain}/create-payment-intent`, {
      method: 'POST',
      body: JSON.stringify({}),
    }).then(async result => {
      var { clientSecret } = await result.json();
      setClientSecret(clientSecret);
    });
  }, []);
  // useEffect(() => {
  //   fetch(`${domain}/create-checkout-session`, {
  //     method: 'POST',
  //     body: JSON.stringify({}),
  //   }).then(async result => {
  //     var { clientSecret } = await result.json();
  //     setClientSecret(clientSecret);
  //   });
  // }, []);

  return (
    <div
      className="App"
      style={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '600px',
        margin: '0 auto',
        alignItems: 'center',
        gap: '16px',
        padding: '32px',
      }}
    >
      <h1>Checkout</h1>
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
};
