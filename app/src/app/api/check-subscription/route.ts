import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import UserModel from '@/models/User';
import { TRIAL_DAYS } from '@/app/assets/config';

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

    if (user.hasSubscription) {
      //  TODO check if subscription is active
      return NextResponse.json({ active: true }, { status: 200 });
    }

    if (!user.trialStartedAt) {
      return NextResponse.json({ isActive: false }, { status: 200 });
    }

    const secondsPassed = Math.floor(
      (Date.now() - new Date(user.trialStartedAt).getTime()) / 1000
    );

    // const isActive = daysPassed < TRIAL_DAYS && minutesPassed < TRIAL_DAYS;
    const isActive = secondsPassed * 1000 < TRIAL_DAYS;

    console.log('response', { isActive, secondsPassed });

    return NextResponse.json({
      email: user.email,
      isTrial: true,
      role: user.role,
      isActive,
      secondsLeft: Math.max(0, TRIAL_DAYS / 1000 - secondsPassed),
      trialStartedAt: user.trialStartedAt,
      trialDuration: TRIAL_DAYS,
    });
  } catch (error) {
    console.error('Error fetching trial:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};
