// app/api/verify-code/route.ts
import { NextResponse } from 'next/server';
import UserModel from '@/models/User';
import VerificationModel from '@/models/VerificationCode';
import { connectToDatabase } from '@/utils/db';

export const POST = async (req: Request) => {
  const { email, code } = await req.json();
  await connectToDatabase();

  const record = await VerificationModel.findOne({ email });

  if (!record || record.code !== code) {
    return NextResponse.json({ success: false, error: 'Invalid code' });
  }

  const newUser = await UserModel.create({
    email,
    password: record.password, // need to be hashed
  });

  await VerificationModel.deleteOne({ email });

  return NextResponse.json({ success: true, userId: newUser._id });
};
