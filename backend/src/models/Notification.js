import mongoose from 'mongoose';

const notificationSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    message: { type: String, required: true },
    type: { type: String, enum: ['appointment', 'prescription', 'billing', 'lab'], required: true },
    readStatus: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
