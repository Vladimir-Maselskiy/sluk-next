import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Будь ласка, додай MONGODB_URI у файл .env.local');
}

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(MONGODB_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log('✅ Підключено до MongoDB Atlas');
  } catch (error) {
    console.error('❌ Помилка підключення до MongoDB', error);
    throw error;
  }
};
