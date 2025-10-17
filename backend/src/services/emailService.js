import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,        // e.g., smtp.gmail.com
  port: process.env.EMAIL_PORT,        // usually 465 or 587
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,      // your email
    pass: process.env.EMAIL_PASS,      // app password or normal password
  },
});

// Send email function
export const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"Doclink Notifications" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
  } catch (error) {
    console.error('Email sending failed:', error.message);
  }
};
