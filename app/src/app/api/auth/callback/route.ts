// app/api/auth/google/callback/route.js
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    if (!code)
      return NextResponse.json(
        { error: 'Something went wrong' },
        { status: 400 }
      );

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const domain = process.env.NEXT_PUBLIC_BASE_URL;
    const redirectUri = `${domain}/api/auth/callback`;

    // Обмінюємо code на access_token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId!,
        client_secret: clientSecret!,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token)
      return NextResponse.json(
        { error: 'Something went wrong' },
        { status: 400 }
      );

    const response = await fetch(new URL('/api/users/google', req.url), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessToken: tokenData.access_token }),
    }).then(res => res.json());

    console.log('response_user', response);

    if (!response.success)
      return NextResponse.json(
        { error: 'Something went wrong' },
        { status: 400 }
      );

    const { user } = response;
    console.log('user', user);

    // Повертаємо HTML з postMessage для popup
    const popupRedirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/google-auth-result?status=success&email=${user.email}&id=${user._id}&#access_token=${tokenData.access_token}`;

    return NextResponse.redirect(popupRedirectUrl);
  } catch (error) {
    console.error('Error fetching access token:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 400 }
    );
  }
}
