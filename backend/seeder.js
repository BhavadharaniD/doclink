// seeder.js
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

// Import models
import User from './src/models/User.js';
import Doctor from './src/models/Doctor.js';
import Appointment from './src/models/Appointment.js';
import HealthMetric from './src/models/HealthMetrics.js';
import LabResult from './src/models/LabResult.js';
import Prescription from './src/models/Prescription.js';
import Billing from './src/models/Billing.js';
import Notification from './src/models/Notification.js';

// Ensure uploads folder exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .catch(err => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  });

mongoose.connection.once('open', () => {
  console.log('MongoDB connected for seeder');
  seed(); // start seeding only after connection is ready
});

// Tamil-style names, specialties, and medicines
const tamilNames = [
  'Arun', 'Karthik', 'Vignesh', 'Ramesh', 'Murugan', 'Anbu', 'Saravanan',
  'Divya', 'Meena', 'Priya', 'Shanthi', 'Kavya', 'Anitha', 'Deepa'
];
const specialties = ['Cardiology', 'Dermatology', 'Orthopedics', 'Pediatrics', 'ENT', 'General'];
const medicinesList = ['Paracetamol', 'Amoxicillin', 'Ibuprofen', 'Metformin', 'Amlodipine', 'Omeprazole'];

// Helper Functions
const randomTamilName = () => tamilNames[Math.floor(Math.random() * tamilNames.length)];
const randomSpecialty = () => specialties[Math.floor(Math.random() * specialties.length)];
const randomMedicine = () => medicinesList[Math.floor(Math.random() * medicinesList.length)];
const randomPhone = () => '9' + Math.floor(100000000 + Math.random() * 900000000);
let emailCounter = 0;
const randomEmail = (name) => {
  emailCounter++;
  return `${name.toLowerCase()}${emailCounter}@gmail.com`;
};

// Generate PDF and return path
const generatePDF = (text, filename) => {
  const doc = new PDFDocument();
  const filePath = path.join('uploads', filename);
  doc.pipe(fs.createWriteStream(filePath));
  doc.text(text);
  doc.end();
  return filePath;
};

// Main seeding function
const seed = async () => {
  try {
    // Delete old data
    await Promise.all([
      User.deleteMany({}),
      Doctor.deleteMany({}),
      Appointment.deleteMany({}),
      HealthMetric.deleteMany({}),
      LabResult.deleteMany({}),
      Prescription.deleteMany({}),
      Billing.deleteMany({}),
      Notification.deleteMany({})
    ]);
    console.log('Old data deleted');

    // Seed Doctors
    const doctors = [];
    const doctorCount = 15;
    for (let i = 0; i < doctorCount; i++) {
      const name = randomTamilName();
      const doctor = new Doctor({
        name,
        email: randomEmail(name),
        password: 'password123', // plain password; pre-save hook will hash
        phone: randomPhone(),
        age: 30 + Math.floor(Math.random() * 20),
        gender: Math.random() > 0.5 ? 'Male' : 'Female',
        speciality: randomSpecialty(),
        experience: 3 + Math.floor(Math.random() * 15),
        availabilityStatus: Math.random() > 0.5 ? 'Online' : 'Offline',
        profilePic: `https://i.pravatar.cc/150?img=${Math.floor(Math.random()*70 + 1)}`
      });
      await doctor.save();
      doctors.push(doctor);
    }
    console.log('Doctors seeded');

    // Seed Users
    const users = [];
    const userCount = 50;
    for (let i = 0; i < userCount; i++) {
      const name = randomTamilName();
      const user = new User({
        name,
        email: randomEmail(name),
        password: 'password123', // plain password
        phone: randomPhone(),
        age: 18 + Math.floor(Math.random() * 50),
        gender: Math.random() > 0.5 ? 'Male' : 'Female',
        address: faker.location.streetAddress(),
        profilePic: `https://i.pravatar.cc/150?img=${Math.floor(Math.random()*70 + 1)}`
      });
      await user.save();
      users.push(user);
    }
    console.log('Users seeded');

    // Seed Appointments & related data
    for (const user of users) {
      const appointmentCount = 1 + Math.floor(Math.random() * 5);
      for (let i = 0; i < appointmentCount; i++) {
        const doctor = doctors[Math.floor(Math.random() * doctors.length)];
        const date = faker.date.soon(60);
        const time = `${Math.floor(Math.random()*12+9)}:${Math.floor(Math.random()*60).toString().padStart(2,'0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`;

        // Appointment
        const appointment = new Appointment({
          userId: user._id,
          doctorId: doctor._id,
          date,
          time,
          status: 'confirmed',
          notes: faker.lorem.sentence()
        });
        await appointment.save();

        // Health Metric
        const healthMetric = new HealthMetric({
          userId: user._id,
          bloodPressure: `${100 + Math.floor(Math.random()*30)}/${60 + Math.floor(Math.random()*20)}`,
          bloodSugar: (70 + Math.floor(Math.random()*50)).toString(),
          bmi: (18 + Math.random()*10).toFixed(1)
        });
        await healthMetric.save();

        // Lab Result PDF
        const labText = `Lab Report for ${user.name} by Dr. ${doctor.name}\nDate: ${date.toDateString()}`;
        const labFileName = `lab_${user._id}_${i}.pdf`;
        const labFilePath = generatePDF(labText, labFileName);
        const labResult = new LabResult({
          patientId: user._id,
          doctorId: doctor._id,
          fileName: labFileName,
          filePath: labFilePath,
          remarks: { note: faker.lorem.sentence() }
        });
        await labResult.save();

        // Prescription PDF
        const medCount = 1 + Math.floor(Math.random()*3);
        const medicines = [];
        for (let j = 0; j < medCount; j++) {
          medicines.push({
            name: randomMedicine(),
            dosage: `${1 + Math.floor(Math.random()*2)} tablet(s) ${Math.random() > 0.5 ? 'daily' : 'twice daily'}`
          });
        }
        const presText = `Prescription for ${user.name} by Dr. ${doctor.name}\nMedicines: ${medicines.map(m=>m.name).join(', ')}`;
        const presFileName = `pres_${user._id}_${i}.pdf`;
        generatePDF(presText, presFileName);

        const prescription = new Prescription({
          doctorId: doctor._id,
          patientId: user._id,
          medicines,
          instructions: 'Take medicines after meals',
          notes: faker.lorem.sentence(),
          templateUsed: 'Standard'
        });
        await prescription.save();

        // Billing
        const billing = new Billing({
          patientId: user._id,
          doctorId: doctor._id,
          amount: 500 + Math.floor(Math.random()*1000),
          status: 'paid',
          paymentDate: date,
          method: ['UPI','Card','Cash'][Math.floor(Math.random()*3)]
        });
        await billing.save();

        // Notifications
        const notifCount = 1 + Math.floor(Math.random()*2);
        for (let n = 0; n < notifCount; n++) {
          const notification = new Notification({
            userId: user._id,
            doctorId: doctor._id,
            message: faker.lorem.sentence(),
            type: ['appointment','prescription','billing','lab'][Math.floor(Math.random()*4)],
            readStatus: Math.random() > 0.5
          });
          await notification.save();
        }
      }
      console.log(`Seeded appointments & related data for user: ${user.name}`);
    }

    console.log('Seeding completed!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
