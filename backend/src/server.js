import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import connectDB from './config/db.js';
import userRoutes from './routes/UserRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import prescriptionRoutes from './routes/prescriptionRoutes.js';
import labResultRoutes from './routes/labresultRoutes.js';
import billingRoutes from './routes/billingRoutes.js';
import testRoute from './routes/testRoutes.js';
import healthMetricsRoutes from './routes/healthMetricsRoutes.js';

const app = express();

// Connect DB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Static folder for uploads
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/api/test', testRoute);
app.use('/api/users', userRoutes);
app.use('/api/doctors', doctorRoutes); 
app.use('/api/admin', adminRoutes);
app.use('/api/appointment', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/labresults', labResultRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/healthmetrics', healthMetricsRoutes);

// 404 handler
app.use((req, res, next) => res.status(404).json({ message: 'Route not found' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

// Start server
console.log('OpenAI API Key:', process.env.OPENAI_API_KEY?.slice(0, 5)+'...');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
