import { NextResponse } from 'next/server';

import { transporter, user as senderEmail } from '@/utils/nodemailer';

const GOOGLE_EMAIL = process.env.FEEDBACK_RECEIVER || senderEmail;

const buildEmailContent = (email: string | null, message: string) => {
  const safeEmail = email || 'Anonymous';
  const escapedMessage = message.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0a2540;">New Feedback from Sluk</h2>
      <p style="margin-bottom: 12px; font-size: 16px;">
        <strong>From:</strong> ${safeEmail}
      </p>
      <div style="padding: 16px; background: #f6f9fc; border-radius: 8px;">
        <h3 style="margin-top: 0; color: #635bff;">Message</h3>
        <p style="white-space: pre-wrap; font-size: 15px; line-height: 1.6; color: #111;">${escapedMessage}</p>
      </div>
    </div>
  `;

  const text = [
    `New feedback from Sluk`,
    `From: ${safeEmail}`,
    '',
    message,
  ].join('\n');

  return { html, text };
};

export const POST = async (request: Request) => {
  try {
    const { email, message } = await request.json();

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    const trimmedEmail =
      typeof email === 'string' && email.trim() ? email.trim() : null;
    const trimmedMessage = message.trim();

    const { html, text } = buildEmailContent(trimmedEmail, trimmedMessage);

    await transporter.sendMail({
      from: `"Sluk Feedback" <${senderEmail}>`,
      to: GOOGLE_EMAIL,
      subject: trimmedEmail
        ? `Sluk feedback from ${trimmedEmail}`
        : 'Sluk feedback from extension',
      text,
      html,
      replyTo: trimmedEmail || undefined,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feedback submit error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
};
