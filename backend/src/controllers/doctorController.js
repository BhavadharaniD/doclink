import Doctor from '../models/Doctor.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Register doctor
// @route   POST /doctor/register
export const registerDoctor = async (req, res) => {
  const { name, email, password, speciality } = req.body;

  const doctorExists = await Doctor.findOne({ email });
  if (doctorExists) return res.status(400).json({ message: 'Doctor already exists' });

  const doctor = await Doctor.create({ name, email, password, speciality });
  if (doctor) {
    res.status(201).json({
      _id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      speciality: doctor.speciality,
      token: generateToken(doctor._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid doctor data' });
  }
};

// @desc    Login doctor
// @route   POST /doctor/login
export const loginDoctor = async (req, res) => {
  const { email, password } = req.body;
  const doctor = await Doctor.findOne({ email });
  if (doctor && (await doctor.matchPassword(password))) {
    res.json({
      _id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      speciality: doctor.speciality,
      token: generateToken(doctor._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// @desc    Update doctor profile
// @route   PUT /doctor/update/:id
export const updateDoctor = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

  const { name, phone, age, gender, address, speciality, experience } = req.body;
  doctor.name = name || doctor.name;
  doctor.phone = phone || doctor.phone;
  doctor.age = age || doctor.age;
  doctor.gender = gender || doctor.gender;
  doctor.address = address || doctor.address;
  doctor.speciality = speciality || doctor.speciality;
  doctor.experience = experience || doctor.experience;

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    doctor.password = await bcrypt.hash(req.body.password, salt);
  }

  const updatedDoctor = await doctor.save();
  res.json(updatedDoctor);
};

// @desc    Get doctor by id
// @route   GET /doctor/:id
export const getDoctorById = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id).select('-password');
  if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
  res.json(doctor);
};

// @desc    Get doctors by speciality
// @route   GET /doctors?speciality=cardiology
export const getDoctors = async (req, res) => {
  const filter = {};
  if (req.query.speciality) filter.speciality = req.query.speciality;

  const doctors = await Doctor.find(filter).select('-password');
  res.json(doctors);
};

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const doctor = await Doctor.findOne({ email });
  if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');
  doctor.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  doctor.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await doctor.save();

  // TODO: send email with resetToken (for now, we return it)
  res.json({ message: 'Password reset token generated', resetToken });
};

// @desc    Reset password
// @route   PUT /doctor/reset-password/:token
export const resetPassword = async (req, res) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const doctor = await Doctor.findOne({
    resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!doctor) return res.status(400).json({ message: 'Invalid or expired token' });

  doctor.password = req.body.password;
  doctor.resetPasswordToken = undefined;
  doctor.resetPasswordExpires = undefined;

  await doctor.save();

  res.json({ message: 'Password has been reset successfully' });
};
// Get doctor's own profile
export const getDoctorProfile = async (req, res) => {
  const doctor = await Doctor.findById(req.doctor._id).select('-password');
  if (doctor) {
    res.json(doctor);
  } else {
    res.status(404).json({ message: 'Doctor not found' });
  }
};
// Update doctor's availability (Online / Offline)
export const updateAvailability = async (req, res) => {
  const doctor = await Doctor.findById(req.doctor._id);
  if (!doctor) {
    return res.status(404).json({ message: 'Doctor not found' });
  }

  doctor.isAvailable = req.body.isAvailable; // true or false
  const updatedDoctor = await doctor.save();

  res.json({
    message: `Doctor is now ${updatedDoctor.isAvailable ? 'Available' : 'Unavailable'}`,
    isAvailable: updatedDoctor.isAvailable,
  });
};

export const uploadProfilePic = async (req, res) => {
  const doctor = await Doctor.findById(req.doctor._id);
  if (!doctor) {
    return res.status(404).json({ message: 'Doctor not found' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Store relative path of uploaded image
  doctor.profilePic = `/uploads/${req.file.filename}`;
  await doctor.save();

  res.json({
    message: 'Profile picture updated successfully',
    profilePic: doctor.profilePic,
  });
};