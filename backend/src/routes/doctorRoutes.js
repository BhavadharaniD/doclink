import express from 'express';
import {
  registerDoctor,
  loginDoctor,
  getDoctorProfile,
  updateDoctor,
  updateAvailability,
 getDoctors,
  uploadProfilePic,
  requestPasswordReset,
  resetPassword,

} from '../controllers/doctorController.js';
import { protect } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// =========================
// Authentication
// =========================
router.post('/register',  protect, authorizeRoles('Admin'), registerDoctor); // Admin only
router.post('/login', loginDoctor); // Doctor only

// =========================
// Profile Management
// =========================
router.get('/:id', protect, getDoctorProfile); // Doctor themselves
router.put('/update/:id', protect, updateDoctor); // Doctor themselves
router.put('/:id/availability', protect, authorizeRoles('Doctor'), updateAvailability); // Doctor themselves
router.put('/upload-profile/:id', protect, upload.single('profilePic'), uploadProfilePic); // Doctor themselves

// =========================
// List Doctors
// =========================
router.get('/', protect, authorizeRoles('admin', 'user'),getDoctors); // Admin & Users (patients)

// =========================
// Reset Password
// =========================
router.post('/password/request-reset', protect, authorizeRoles('Doctor'), requestPasswordReset);
router.post('/password/reset', protect, authorizeRoles('Doctor'), resetPassword);

export default router;
