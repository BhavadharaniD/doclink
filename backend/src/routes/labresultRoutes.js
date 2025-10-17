// src/routes/labResultRoutes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { protect } from '../middlewares/auth.js';
import {
  uploadLabResult,
  getLabResultsByPatient,
  getLabResultsByDoctor,
  deleteLabResult
} from '../controllers/labresultController.js';

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/labresults'); // store files in /uploads/labresults
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Routes
router.post('/upload', protect, upload.single('file'), uploadLabResult);
router.get('/patient/:id', protect, getLabResultsByPatient);
router.get('/doctor/:id', protect, getLabResultsByDoctor);
router.delete('/:id', protect, deleteLabResult);

export default router;
