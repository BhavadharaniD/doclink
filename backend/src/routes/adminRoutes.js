import express from 'express';
const router = express.Router();

import {
  loginAdmin,
  getAllDoctors,
  addDoctor,
  editDoctor,
  deleteDoctor,
  updateDoctorAvailability,
  getOverview,
  getReports,
  registerAdmin,
} from '../controllers/adminController.js';

import { protect } from '../middlewares/auth.js'; // JWT verification
import { authorizeRoles } from '../middlewares/roleMiddleware.js'; // Role-based check

// Admin Login
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
// Doctor Management
router.get('/doctors', protect, authorizeRoles('admin'), getAllDoctors);
router.post('/doctor/add', protect, authorizeRoles('admin'), addDoctor);
router.put('/doctor/edit/:id', protect, authorizeRoles('admin'), editDoctor);
router.delete('/doctor/delete/:id', protect, authorizeRoles('admin'), deleteDoctor);
router.put('/doctor/:id/availability', protect, authorizeRoles('admin'), updateDoctorAvailability);
//reports
router.get('/overview', protect, authorizeRoles('admin'), getOverview);
router.get('/reports', protect, authorizeRoles('admin'), getReports);


export default router;
