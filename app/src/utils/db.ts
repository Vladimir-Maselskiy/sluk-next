// lib/db.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';
const stripe = process.env.STRIPE_SECRET_KEY;

console.log('MONGODB_URI', MONGODB_URI);
console.log('stripe', stripe);

export const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB');
  }
};
