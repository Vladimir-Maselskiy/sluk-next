import { NextRequest, NextResponse } from 'next/server';

import { connectToDatabase } from '@/utils/db';
import UserModel from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    const { accessToken } = await req.json();

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Access token is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    console.log('accessToken', accessToken);

    const response = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ).then(res => res.json());
    const { email } = response;

    const user = await UserModel.findOne({ email });

    if (!user) {
      const newUser = await UserModel.create({
        email,
      });
      return NextResponse.json({ success: true, user: newUser });
    }

    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error('Error fetching user:', err);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
