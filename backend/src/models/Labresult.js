// src/models/LabResult.js
import mongoose from 'mongoose';

const labResultSchema = mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: false }, // optional if patient uploads
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    remarks: { type: String, default: '' },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const LabResult = mongoose.model('LabResult', labResultSchema);
export default LabResult;
