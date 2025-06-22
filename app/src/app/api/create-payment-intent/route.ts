import { NextRequest, NextResponse } from 'next/server';
import stripe from '../../../../lib/stripe';
import UserModel from '@/models/User';

export const POST = async (request: NextRequest) => {
  const { cost, userId, duration } = await request.json();
  console.log('cost', cost, 'userId', userId, 'duration', duration);
  if (!cost || !userId || !duration) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }
  const user = UserModel.findById(userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  const amount = cost * duration * 100;
  console.log('amount', amount);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.ceil(amount),
      currency: 'eur',
      payment_method_types: ['card'],
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Something went wrong' },
      { status: 400 }
    );
  }
};
