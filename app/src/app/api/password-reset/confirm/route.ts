import { NextResponse } from 'next/server';

import { connectToDatabase } from '@/utils/db';
import PasswordResetToken from '@/models/PasswordResetToken';
import UserModel from '@/models/User';

export const POST = async (request: Request) => {
  try {
    const { email, code, password } = await request.json();

    if (!email || !code || !password) {
      return NextResponse.json(
        { success: false, error: 'Email, code, and new password are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const tokenRecord = await PasswordResetToken.findOne({ email });

    if (!tokenRecord || tokenRecord.code !== code) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired reset code' },
        { status: 400 }
      );
    }

    const user = await UserModel.findOneAndUpdate(
      { email },
      { password },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    await PasswordResetToken.deleteOne({ email });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Password reset confirm error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
};
