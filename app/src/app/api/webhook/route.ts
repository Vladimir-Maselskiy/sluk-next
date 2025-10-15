import UserModel from '@/models/User';
import { connectToDatabase } from '@/utils/db';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

function addMonthsSafe(date: Date, monthsToAdd: number): Date {
  const newDate = new Date(date);
  const originalDay = newDate.getDate();

  newDate.setDate(1);
  newDate.setMonth(newDate.getMonth() + monthsToAdd);

  const lastDayOfNewMonth = new Date(
    newDate.getFullYear(),
    newDate.getMonth() + 1,
    0
  ).getDate();

  newDate.setDate(Math.min(originalDay, lastDayOfNewMonth));

  return newDate;
}

// function addOneMinutesSafe(date: Date): Date {
//   const newDate = new Date(date);
//   newDate.setSeconds(newDate.getSeconds() + 60 * 60);
//   return newDate;
// }

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-04-30.basil',
  });

  const sig = req.headers.get('stripe-signature')!;
  const rawBody = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    if (err instanceof Error) {
      console.error('Webhook Error:', err.message);
      return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    } else {
      console.error('Unknown Error:', err);
      return new NextResponse('Unknown Webhook Error', { status: 400 });
    }
  }

  // ===> Обробка оплати
  await connectToDatabase();
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    const metadata =
      paymentIntent.metadata || ({} as { userId: string; duration: string });
    const { userId, duration } = metadata;

    if (!userId) {
      console.warn('Missing userId in paymentIntent.metadata');
      return NextResponse.json({ received: true, error: 'Missing userId' });
    }

    const now = new Date();

    const months = Number(duration) || 1;
    const subscriptionExpiresAt = addMonthsSafe(now, months);

    await UserModel.findByIdAndUpdate(userId, {
      subscription: {
        isSubscription: true,
        subscriptionStartedAt: now,
        subscriptionExpiresAt,
        stripePaymentIntentId: paymentIntent.id,
      },
    });
  }

  return NextResponse.json({ received: true });
}
