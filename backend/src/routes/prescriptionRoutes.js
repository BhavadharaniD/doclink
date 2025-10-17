import express from 'express';
const router = express.Router();
import {
  createPrescription,
  aiGeneratePrescription,
  getPrescriptionsByDoctor,
  getPrescriptionsByPatient,
  updatePrescription,
  deletePrescription,
  autocompleteMedicine,
  getPrescriptionTemplate
} from '../controllers/prescriptionController.js';

import { protect } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

// Doctor-only routes
router.post('/create', protect, authorizeRoles('Doctor'), createPrescription);
router.post('/ai/generate', protect, authorizeRoles('Doctor'), aiGeneratePrescription);
router.get('/doctor/:doctorId', protect, authorizeRoles('Doctor'), getPrescriptionsByDoctor);
router.get('/patient/:patientId', protect, authorizeRoles('Doctor', 'user'), getPrescriptionsByPatient);
router.put('/:id/update', protect, authorizeRoles('Doctor'), updatePrescription);
router.delete('/:id', protect, authorizeRoles('Doctor'), deletePrescription);

// Autocomplete + Templates
router.get('/medicines', protect, authorizeRoles('Doctor'), autocompleteMedicine);
router.get('/template', protect, authorizeRoles('Doctor'), getPrescriptionTemplate);

export default router;
