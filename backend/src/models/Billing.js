import mongoose from 'mongoose';

const billingSchema = mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['paid', 'pending'], default: 'pending' },
    paymentDate: { type: Date },
    method: { type: String, enum: ['UPI', 'Card', 'Cash'], default: 'UPI' },
  },
  { timestamps: true }
);

const Billing = mongoose.model('Billing', billingSchema);
export default Billing;
