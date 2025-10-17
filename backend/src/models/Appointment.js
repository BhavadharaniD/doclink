import mongoose from 'mongoose';

const appointmentSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'confirmed', 'completed', 'canceled', 'rejected', 'rescheduled'], 
      default: 'pending' 
    },
    notes: { type: String, default: '' }, // optional field for extra info
  },
  { timestamps: true }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
