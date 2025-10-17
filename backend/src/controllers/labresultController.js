// src/controllers/labResultController.js
import LabResult from '../models/Labresult.js';
import path from 'path';
import fs from 'fs';

export const uploadLabResult = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const { patientId, remarks } = req.body;

    // Only doctor or patient themselves can upload
    if (req.user.role === 'patient' && req.user._id.toString() !== patientId) {
      return res.status(403).json({ message: 'Not authorized to upload for this patient' });
    }

    const filePath = path.join('uploads/labresults', req.file.filename);
    let jsonData = null;

    // ✅ If the uploaded file is a .json file, read and parse it
    if (req.file.mimetype === 'application/json' || path.extname(req.file.originalname) === '.json') {
      try {
        const data = fs.readFileSync(req.file.path, 'utf8');
        jsonData = JSON.parse(data);
      } catch (err) {
        return res.status(400).json({ message: 'Invalid JSON file format' });
      }
    }

    // ✅ Create a record in DB
    const labResult = await LabResult.create({
      patientId,
      doctorId: req.user.role === 'doctor' ? req.user._id : null,
      fileName: req.file.originalname,
      filePath,
      remarks: remarks || '',
      jsonData, // optional field to store parsed JSON
    });

    res.status(201).json({ message: 'Lab result uploaded successfully', labResult });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Delete lab result
export const deleteLabResult = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the lab result
    const labResult = await LabResult.findById(id);
    if (!labResult) {
      return res.status(404).json({ message: 'Lab result not found' });
    }

    // Only the uploader can delete
    const uploaderId = labResult.doctorId ? labResult.doctorId.toString() : labResult.patientId.toString();
    if (req.user._id.toString() !== uploaderId) {
      return res.status(403).json({ message: 'Not authorized to delete this lab result' });
    }

    // Delete the file from uploads
    fs.unlink(labResult.filePath, (err) => {
      if (err) console.error('Failed to delete file:', err);
    });

    // Delete from database
    await labResult.deleteOne();

    res.status(200).json({ message: 'Lab result deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get lab results uploaded by a specific doctor
export const getLabResultsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    // Only the doctor themselves or an admin can access
    if (req.user.role === 'doctor' && req.user._id.toString() !== doctorId) {
      return res.status(403).json({ message: 'Not authorized to view these lab results' });
    }

    // Fetch lab results from DB
    const labResults = await LabResult.find({ doctorId }).populate('patientId', 'name email');

    res.status(200).json({ labResults });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get lab results for a specific patient
export const getLabResultsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Only the patient themselves, the doctor who uploaded, or an admin can access
    if (
      req.user.role === 'patient' && req.user._id.toString() !== patientId &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to view these lab results' });
    }

    // Fetch lab results from DB
    const labResults = await LabResult.find({ patientId }).populate('doctorId', 'name email');

    res.status(200).json({ labResults });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
