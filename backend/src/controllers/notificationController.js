import Notification from '../models/Notification.js';

// Get notifications for user
export const getUserNotifications = async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(notifications);
};

// Get notifications for doctor
export const getDoctorNotifications = async (req, res) => {
  const notifications = await Notification.find({ doctorId: req.user._id }).sort({ createdAt: -1 });
  res.json(notifications);
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) return res.status(404).json({ message: 'Not found' });

  notification.readStatus = true;
  await notification.save();
  res.json({ message: 'Marked as read', notification });
};
