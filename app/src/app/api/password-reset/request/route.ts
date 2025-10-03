import { NextResponse } from 'next/server';

import { connectToDatabase } from '@/utils/db';
import UserModel from '@/models/User';
import PasswordResetToken from '@/models/PasswordResetToken';
import { transporter, user as senderEmail } from '@/utils/nodemailer';

export const POST = async (request: Request) => {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existingUser = await UserModel.findOne({ email });

    console.log('existingUser', existingUser);

    if (!existingUser) {
      return NextResponse.json({
        success: true,
        message: 'An account with this email does not exist.',
        redirect: false,
      });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await PasswordResetToken.findOneAndUpdate(
      { email },
      { email, code, createdAt: new Date() },
      { upsert: true }
    );

    await transporter.sendMail({
      from: `"Sluk (no reply)" <${senderEmail}>`,
      to: email,
      subject: 'Reset your Sluk password',
      text: `Your password reset code is: ${code}`,
    });

    return NextResponse.json({
      success: true,
      message: 'If the account exists, a reset code has been sent.',
      redirect: true,
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
};
