import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import crypto from 'crypto';
import mongoose from 'mongoose';
// 📅 Book Appointment (User)
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;

    const normalizedDoctorId = new mongoose.Types.ObjectId(doctorId);

    const doctor = await Doctor.findById(normalizedDoctorId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    const appointment = await Appointment.create({
      userId: req.user._id,
      doctorId: normalizedDoctorId,
      date,
      time,
    });

    res.status(201).json({ message: 'Appointment booked successfully', appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//getuserappointments
export const getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id })
      .populate('doctorId', 'name speciality') 
      .sort({ date: -1 });
console.log('Populated appointments:', appointments);
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.user._id;

    const appointments = await Appointment.find({ doctorId })
      .populate('userId', 'name email')
      .sort({ date: -1 });

    res.json(appointments);
  } catch (error) {
    console.error('getDoctorAppointments error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 📋 Get Appointment by ID
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('doctorId', 'name speciality');

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    // Access control: only user or doctor involved can view
    if (
      appointment.userId._id.toString() !== req.user._id.toString() &&
      appointment.doctorId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Cancel Appointment (User)
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    if (appointment.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    if (appointment.status === 'confirmed' || appointment.status === 'completed')
      return res.status(400).json({ message: 'Cannot cancel confirmed/completed appointment' });

    appointment.status = 'canceled';
    appointment.reason = req.body.reason || '';
    await appointment.save();

    res.json({ message: 'Appointment canceled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Approve Appointment (Doctor)
export const approveAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    if (appointment.doctorId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    appointment.status = 'confirmed';
    await appointment.save();
    res.json({ message: 'Appointment confirmed successfully', appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🚫 Reject Appointment (Doctor)
export const rejectAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    if (appointment.doctorId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    appointment.status = 'rejected';
    appointment.reason = req.body.reason || '';
    await appointment.save();

    res.json({ message: 'Appointment rejected successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔄 Reschedule Appointment (User)
export const rescheduleAppointment = async (req, res) => {
  try {
    const { date, time } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    if (appointment.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    appointment.rescheduledFrom = appointment.date;
    appointment.date = date;
    appointment.time = time;
    appointment.status = 'rescheduled';
    await appointment.save();

    res.json({ message: 'Appointment rescheduled successfully', appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🧾 Mark as Completed (Doctor)
export const markCompleted = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: 'completed' },
      { new: true }
    );

    // Mark patient as inactive if this was the last ongoing appointment
    const patientId = appointment.patient;
    const ongoingAppointments = await Appointment.find({
      patient: patientId,
      status: { $in: ['scheduled', 'ongoing'] }
    });

    if (ongoingAppointments.length === 0) {
      await User.findByIdAndUpdate(patientId, { isActive: false });
    }

    res.status(200).json({ message: 'Appointment completed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const joinAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Allow only user or doctor who belongs to this appointment
    if (
      appointment.userId.toString() !== req.user.id &&
      appointment.doctorId.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Only confirmed appointments can be joined
    if (appointment.status !== 'confirmed') {
      return res
        .status(400)
        .json({ message: 'Appointment not confirmed yet' });
    }

    // If no meeting link, generate a new one (mock link)
    if (!appointment.meetingLink) {
      const uniqueKey = crypto.randomBytes(6).toString('hex');
      appointment.meetingLink = `https://meet.doclink.com/${uniqueKey}`;
      await appointment.save();
    }

    res.json({
      message: 'Meeting link ready',
      meetingLink: appointment.meetingLink,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const addAppointmentNotes = async (req, res) => {
  try {
    const { notes } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    if (appointment.doctorId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    appointment.notes = notes;
    await appointment.save();
    res.json({ message: 'Notes added successfully', appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};