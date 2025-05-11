import { NextResponse } from 'next/server';

export const GET = async () => {
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
  console.log(publishableKey);

  return NextResponse.json({ publishableKey });
};
