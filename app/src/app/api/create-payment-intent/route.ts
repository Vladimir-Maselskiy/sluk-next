import { NextResponse } from 'next/server';
import stripe from '../../../../lib/stripe';

export const POST = async () => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 10099,
      currency: 'usd',
      payment_method_types: ['card'],
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
