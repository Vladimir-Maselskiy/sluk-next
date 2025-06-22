import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

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
  } catch (err: any) {
    console.error('Webhook Error:', err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // ===> Обробка оплати
  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object as Stripe.PaymentIntent;

    const metadata = intent;
    // const metadata = intent.metadata.userId;
    // const plan = intent.metadata.plan;

    // const createdAt = new Date(intent.created * 1000);
    // const periodDays = plan === 'pro' ? 30 : 7;

    // const expiresAt = new Date(createdAt);
    // expiresAt.setDate(expiresAt.getDate() + periodDays);

    // // записуєш у MongoDB:
    // await db.subscriptions.updateOne(
    //   { userId },
    //   {
    //     $set: {
    //       plan,
    //       stripePaymentId: intent.id,
    //       status: 'active',
    //       startedAt: createdAt,
    //       expiresAt,
    //     },
    //   },
    //   { upsert: true }
    // );

    console.log('🔔 metadata:', metadata);
  }

  return new NextResponse('OK', { status: 200 });
}
