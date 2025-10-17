import express from 'express';
import { protect } from '../middlewares/auth.js';
import {
  createBill,
  getBillsByPatient,
  getBillsByDoctor,
  payBill,
  deleteBill
} from '../controllers/billingController.js';

const router = express.Router();

router.post('/', protect, createBill); 
router.get('/patient/:id', protect, getBillsByPatient);
router.get('/doctor/:id', protect, getBillsByDoctor);
router.put('/pay/:id', protect, payBill);
router.delete('/:id', protect, deleteBill); 

export default router;
