import { NextResponse } from 'next/server';

export const GET = async () => {
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;

  return NextResponse.json({ publishableKey });
};
