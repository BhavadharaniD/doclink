import mongoose from 'mongoose';
import fs from 'fs-extra';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

import User from './src/models/User.js';
import Doctor from './src/models/Doctor.js';
import LabResult from './src/models/LabResult.js';
import Appointment from './src/models/Appointment.js';

const MONGO_URI = process.env.MONGO_URI;

async function connectDB() {
  await mongoose.connect(MONGO_URI);
  console.log('MongoDB connected');
}

async function seedLabResults() {
  await connectDB();

  const labData = await fs.readJSON(path.join('src','uploads','labresults', 'lab_results_seed.json'));

  for (const item of labData) {
    // 1️⃣ Create User if not exists
    let user = await User.findOne({ name: item.patientName });
    if (!user) {
      user = await User.create({
        name: item.patientName,
        email: item.patientName.toLowerCase().replace(/ /g, '.') + '@example.com',
        password: 'password123',
        age: Math.floor(Math.random() * 30 + 20),
        gender: Math.random() > 0.5 ? 'Male' : 'Female',
      });
      console.log('Created user:', user.name);
    }

    // 2️⃣ Create Doctor if not exists
    let doctor = await Doctor.findOne({ name: item.referringDoctor });
    if (!doctor) {
      doctor = await Doctor.create({
        name: item.referringDoctor,
        email: item.referringDoctor.toLowerCase().replace(/ /g, '.') + '@example.com',
        password: 'password123',
        speciality: 'General Physician',
      });
      console.log('Created doctor:', doctor.name);
    }

    // 3️⃣ Create LabResult
    const labResult = await LabResult.create({
      patientId: user._id,
      doctorId: doctor._id,
      fileName: item.fileName,
      filePath: `/uploads/${item.fileName}`,
      remarks: item.remarks,
      uploadedAt: item.uploadedAt,
    });
    console.log('Created LabResult:', labResult.fileName);

    // 4️⃣ Create Appointment
    const appointment = await Appointment.create({
      userId: user._id,
      doctorId: doctor._id,
      date: item.uploadedAt,
      time: '10:00 AM',
      status: 'completed',
      notes: 'Auto-created from seed',
    });
    console.log('Created Appointment for:', user.name);
  }

  mongoose.connection.close();
  console.log('Seeding finished!');
}

seedLabResults();
