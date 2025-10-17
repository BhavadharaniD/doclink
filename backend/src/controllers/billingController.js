import Billing from '../models/Billing.js';

// Create new bill (doctor/admin generates)
export const createBill = async (req, res) => {
  try {
    const { patientId, doctorId, amount, method } = req.body;

    const bill = await Billing.create({ patientId, doctorId, amount, method });
    res.status(201).json({ message: 'Bill created', bill });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Simulate bill payment (no Razorpay)
export const payBill = async (req, res) => {
  try {
    const { billId } = req.body;

    const bill = await Billing.findById(billId);
    if (!bill) return res.status(404).json({ message: 'Bill not found' });

    // Simulate successful payment
    bill.status = 'paid';
    bill.paymentDate = Date.now();
    await bill.save();

    res.json({ message: 'Payment successful', bill });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get bills by patient
export const getBillsByPatient = async (req, res) => {
  try {
    const bills = await Billing.find({ patientId: req.params.id }).sort({ createdAt: -1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get bills by doctor
export const getBillsByDoctor = async (req, res) => {
  try {
    const bills = await Billing.find({ doctorId: req.params.id }).sort({ createdAt: -1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Optional: Delete a bill (admin only)
export const deleteBill = async (req, res) => {
  try {
    await Billing.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bill deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
