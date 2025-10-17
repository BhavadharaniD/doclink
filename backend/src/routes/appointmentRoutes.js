import express from 'express';
const router = express.Router();

import {
  bookAppointment,
  getUserAppointments,
  cancelAppointment,
  getDoctorAppointments,
  approveAppointment,
  rejectAppointment,
  markCompleted,
  joinAppointment,
  rescheduleAppointment,
  getAppointmentById,
  addAppointmentNotes,
  
} from '../controllers/appointmentController.js';

import { protect } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

// 🩺 USER ROUTES
router.post('/book', protect, authorizeRoles('user'), bookAppointment);
router.get('/user/:id', protect, authorizeRoles('user'), getUserAppointments);
router.put('/cancel/:id', protect, authorizeRoles('user'), cancelAppointment);
router.put('/reschedule/:id', protect, authorizeRoles('user'), rescheduleAppointment);
router.get('/:id', protect, authorizeRoles('user', 'Doctor'), getAppointmentById);
router.get('/join/:id', protect, authorizeRoles('user', 'Doctor'), joinAppointment);

// 🧑‍⚕️ DOCTOR ROUTES
router.get('/doctor/:id', protect, authorizeRoles('Doctor'), getDoctorAppointments);
router.put('/approve/:id', protect, authorizeRoles('Doctor'), approveAppointment);
router.put('/reject/:id', protect, authorizeRoles('Doctor'), rejectAppointment);
router.put('/complete/:id', protect, authorizeRoles('Doctor'), markCompleted);
router.put('/:id/notes', protect, authorizeRoles('Doctor'), addAppointmentNotes);


export default router;
