// models/HealthMetric.js
import mongoose from 'mongoose';

const healthMetricSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bloodPressure: String,
  bloodSugar: String,
  bmi: String,
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('HealthMetric', healthMetricSchema);