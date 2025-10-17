import fs from 'fs';
import path from 'path';
import Prescription from '../models/Prescription.js';
import { generatePrescriptionAI } from '../services/aiservice.js';



const medicinesPath = path.resolve('data/medicines.json');
const templatesPath = path.resolve('data/templates.json');

const medicinesList = JSON.parse(fs.readFileSync(medicinesPath, 'utf-8'));
const templates = JSON.parse(fs.readFileSync(templatesPath, 'utf-8'));
// Create manual prescription
export const createPrescription = async (req, res) => {
  try {
    const { patientId, medicines, instructions, templateUsed } = req.body;

    const prescription = await Prescription.create({
      doctorId: req.user._id,
      patientId,
      medicines,
      instructions,
      templateUsed: templateUsed || '',
       date: new Date()
    });

    res.status(201).json({ message: 'Prescription created', prescription });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// AI-generated prescription
export const aiGeneratePrescription = async (req, res) => {
  try {
    const { patientId, diagnosis, age, allergies, templateUsed } = req.body;

    const aiResponse = await generatePrescriptionAI(diagnosis, age, allergies);
    const prescriptionData = JSON.parse(aiResponse);

    prescriptionData.templateUsed = templateUsed || '';

    const prescription = await Prescription.create({
      doctorId: req.user._id,
      patientId,
      medicines: prescriptionData.medicines,
      instructions: prescriptionData.instructions,
      notes: prescriptionData.notes || 'Follow standard medical advice.',
      templateUsed: prescriptionData.templateUsed,
       date: new Date()
    });

    // Log AI usage with Inngest
  

    res.status(201).json({ message: 'AI prescription created', prescription });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get prescriptions by doctor
export const getPrescriptionsByDoctor = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;

    const prescriptions = await Prescription.find({ doctorId })
      .sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (error) {
    console.error('getPrescriptionsByDoctor error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get prescriptions by patient
export const getPrescriptionsByPatient = async (req, res) => {
  const prescriptions = await Prescription.find({ patientId: req.params.patientId });
  res.json(prescriptions);
};

// Update prescription
export const updatePrescription = async (req, res) => {
  const prescription = await Prescription.findById(req.params.id);
  if (!prescription) return res.status(404).json({ message: 'Not found' });

  Object.assign(prescription, req.body);
  await prescription.save();
  res.json({ message: 'Prescription updated', prescription });
};

// Delete prescription
export const deletePrescription = async (req, res) => {
  await Prescription.findByIdAndDelete(req.params.id);
  res.json({ message: 'Prescription deleted' });
};

// Medicine autocomplete
export const autocompleteMedicine = (req, res) => {
  const query = req.query.query?.toLowerCase() || '';
  const results = medicinesList.filter(med =>
    med.name.toLowerCase().includes(query)
  );
  res.json(results);
};

// Prescription template
export const getPrescriptionTemplate = (req, res) => {
  const condition = req.query.condition?.toLowerCase();
  const template = templates.find(t => t.condition.toLowerCase() === condition);
  if (!template) return res.status(404).json({ message: 'Template not found' });
  res.json(template);
};
