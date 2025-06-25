import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import UserModel from '@/models/User';
import { TRIAL_TIME } from '@/app/assets/config';

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    // DB connection
    await connectToDatabase();

    const user = await UserModel.findOne({ _id: userId });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.subscription.isSubscription) {
      const {
        subscriptionExpiresAt,
        subscriptionStartedAt,
        stripePaymentIntentId,
      } = user.subscription;
      if (
        !subscriptionExpiresAt ||
        !subscriptionStartedAt ||
        !stripePaymentIntentId
      ) {
        return NextResponse.json(
          { error: 'Subscription not found' },
          { status: 404 }
        );
      }
      const date = new Date(subscriptionExpiresAt).getTime();
      const now = new Date().getTime();
      if (date < now) {
        return NextResponse.json({
          email: user.email,
          role: user.role,
          isActive: false,
          isSubscriptionStarted: true,
          subscriptionExpiresAt,
          trialStartedAt: user.trialStartedAt,
          trialDuration: TRIAL_TIME,
        });
      } else {
        return NextResponse.json({
          email: user.email,
          role: user.role,
          isActive: true,
          isSubscriptionStarted: true,
          subscriptionExpiresAt,
          trialStartedAt: user.trialStartedAt,
          trialDuration: TRIAL_TIME,
        });
      }
    }

    if (!user.trialStartedAt) {
      return NextResponse.json({ isActive: false }, { status: 200 });
    }

    const secondsPassed = Math.floor(
      (Date.now() - new Date(user.trialStartedAt).getTime()) / 1000
    );

    const isActive = secondsPassed * 1000 < TRIAL_TIME;

    return NextResponse.json({
      email: user.email,
      role: user.role,
      isActive,
      isSubscriptionStarted: false,
      subscriptionExpiresAt: null,
      trialStartedAt: user.trialStartedAt,
      trialDuration: TRIAL_TIME,
    });
  } catch (error) {
    console.error('Error fetching trial:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};
