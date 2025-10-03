import { NextRequest, NextResponse } from 'next/server';
import stripe from '../../../../lib/stripe';
import UserModel from '@/models/User';
import { connectToDatabase } from '@/utils/db';

export const POST = async (request: NextRequest) => {
  const { cost, userId, duration } = await request.json();
  if (!cost || !userId || !duration) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  // DB connection
  await connectToDatabase();

  const user = await UserModel.findById(userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  const amount = cost * duration * 100;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.ceil(amount),
      currency: 'eur',
      payment_method_types: ['card'],
      metadata: {
        userId,
        duration: String(duration),
      },
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
