import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import UserModel from '@/models/User';
import { transporter, user } from '@/utils/nodemailer';
import VerificationModel from '@/models/VerificationCode';

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({
        status: 400,
        success: false,
        error: 'Email and password are required',
      });
    }

    // DB connection
    await connectToDatabase();

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    console.log('existingUser', existingUser);

    if (existingUser) {
      return NextResponse.json({
        status: 409,
        success: false,
        error: 'This email is already registered',
      });
    }

    const code = Math.floor(10000 + Math.random() * 90000).toString();

    await VerificationModel.findOneAndUpdate(
      { email },
      { email, password, code, createdAt: new Date() },
      { upsert: true }
    );

    await transporter.sendMail({
      from: `"Sluk (not reply)" <${user}>`,
      to: email,
      subject: 'Verify your email',
      text: `Your verification code is: ${code}`,
    });

    return NextResponse.json({
      success: true,
      status: 'awaiting_verification',
    });
  } catch (error) {
    console.error('Send error:', error);
    return NextResponse.json({
      status: 500,
      success: false,
      error: String(error),
    });
  }
};
