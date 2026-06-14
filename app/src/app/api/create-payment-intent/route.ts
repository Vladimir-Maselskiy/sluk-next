import { NextRequest, NextResponse } from 'next/server';
import stripe from '../../../../lib/stripe';
import UserModel from '@/models/User';
import { connectToDatabase } from '@/utils/db';

const SUBSCRIPTION_PLANS: Record<number, { amount: number; duration: number }> =
  {
    3: { amount: 300, duration: 3 },
    12: { amount: 900, duration: 12 },
  };

export const POST = async (request: NextRequest) => {
  const { userId, duration } = await request.json();
  if (!userId || !duration) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  const plan = SUBSCRIPTION_PLANS[Number(duration)];
  if (!plan) {
    return NextResponse.json(
      { error: 'Unsupported subscription duration' },
      { status: 400 }
    );
  }

  // DB connection
  await connectToDatabase();

  const user = await UserModel.findById(userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: plan.amount,
      currency: 'eur',
      payment_method_types: ['card'],
      metadata: {
        userId,
        duration: String(plan.duration),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: plan.amount,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Something went wrong' },
      { status: 400 }
    );
  }
};
