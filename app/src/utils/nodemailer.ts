// lib/nodemailer.ts
import nodemailer from 'nodemailer';

export const user = process.env.GOOGLE_EMAIL || '';
const pass = process.env.GOOGLE_APP_KEY || '';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user,
    pass,
  },
});
