import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import UserModel from '@/models/User';
import { TRIAL_TIME } from '@/app/assets/config';

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // DB connection
    await connectToDatabase();
    const trialStartedAt = new Date().toISOString();
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        trialStartedAt,
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const secondsPassed = Math.floor(
      (Date.now() - new Date(updatedUser.trialStartedAt).getTime()) / 1000
    );

    const isTrial = secondsPassed < TRIAL_TIME / 1000;

    return NextResponse.json({
      email: updatedUser.email,
      isTrial,
      role: updatedUser.role,
      isActive: true,
      trialStartedAt: updatedUser.trialStartedAt,
      trialDuration: TRIAL_TIME,
    });
  } catch (error) {
    console.error('Error fetching trial:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};
