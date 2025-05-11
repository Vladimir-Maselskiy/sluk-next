import { NextResponse } from 'next/server';

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-04-30.basil',
});

export const POST = async () => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Something went wrong' },
      { status: 400 }
    );
  }
};
