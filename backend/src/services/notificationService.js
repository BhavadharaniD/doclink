import Notification from '../models/Notification.js';
import { sendEmail } from './emailService.js';

// Create & send notification
export const createNotification = async ({ userId, doctorId, message, type, email }) => {
  // Save to DB
  const notification = await Notification.create({ userId, doctorId, message, type });

  // Send email if email provided
  if (email) {
    await sendEmail(email, `New ${type} Notification`, message);
  }

  return notification;
};
