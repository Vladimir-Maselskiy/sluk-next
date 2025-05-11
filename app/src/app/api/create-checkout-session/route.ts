import { NextResponse } from 'next/server';

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-04-30.basil',
});

export const POST = async () => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'T-shirt',
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    ui_mode: 'custom',
    // The URL of your payment completion page
    return_url: 'https://example.com/return?session_id={CHECKOUT_SESSION_ID}',
  });

  return NextResponse.json({
    checkoutSessionClientSecret: session.client_secret,
  });
};
