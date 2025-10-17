import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/yourDB';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const resetPassword = async () => {
  try {
    const newPassword = 'Sanjeevi123';
    const hashed = await bcrypt.hash(newPassword, 10);

    const result = await User.updateOne(
      { email: 'sanjeevi@extrapower.com' },
      { password: hashed }
    );

    if (result.modifiedCount > 0) {
      console.log('Password reset successful!');
    } else {
      console.log('User not found or password unchanged.');
    }

    process.exit();
  } catch (error) {
    console.error('Error resetting password:', error);
    process.exit(1);
  }
};

resetPassword();
