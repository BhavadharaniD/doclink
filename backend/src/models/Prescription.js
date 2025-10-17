import mongoose from 'mongoose';

const medicineSchema = mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
});

const prescriptionSchema = mongoose.Schema(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    medicines: [medicineSchema], // manual or AI-suggested
    instructions: { type: String, required: true }, // manual or AI
    notes: { type: String, default: '' }, // AI advice or extra notes
    templateUsed: { type: String, default: '' }, // optional template name
  },
  { timestamps: true }
);

const Prescription = mongoose.model('Prescription', prescriptionSchema);

export default Prescription;
