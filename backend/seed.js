import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Prescription from './src/models/Prescription.js'; // adjust path if needed

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('Error: MONGO_URI not defined in .env');
  process.exit(1);
}

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

const seedPrescriptions = async () => {
  try {
    const patientId = '68ee7e7376a0c934c5cc9cc9'; // Sanjeevi
    const doctorId = '68e93ed18d7fb3357c8be2d3'; // Dr.Sarah Johnson

    // Clear existing prescriptions for this patient
    await Prescription.deleteMany({ patientId });

    const prescriptions = [];

    // Create 5 prescriptions for 5 consecutive days
    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (5 - i));

      prescriptions.push({
        patientId,
        doctorId,
        medicines: [
          { name: 'Medicine A', dosage: '1 tablet twice a day' },
          { name: 'Medicine B', dosage: '500mg once a day' },
        ],
        instructions: 'Follow the above medication and take after food.',
        notes: `Prescription notes for day ${i + 1}`,
        templateUsed: `Template ${i + 1}`,
        createdAt: date,
        updatedAt: date,
      });
    }

    await Prescription.insertMany(prescriptions);
    console.log('Prescriptions seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding prescriptions:', error);
    process.exit(1);
  }
};

seedPrescriptions();
