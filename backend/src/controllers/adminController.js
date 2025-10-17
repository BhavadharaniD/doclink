
import Admin from '../models/Admin.js';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import generateToken from '../utils/jwt.js';

export const registerAdmin = async (req, res) => {
  const { name, email, password, phone, age,role } = req.body;

  const AdminExists = await Admin.findOne({ email });
  if (AdminExists) return res.status(400).json({ message: 'Admin already exists' });

  const admin = new Admin({ name, email, password, phone, age, role });
  await admin.save();
  if (admin) {
    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// Login user
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (admin && (await admin.matchPassword(password))) {
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};
// ✅ Get all doctors
export const getAllDoctors = async (req, res) => {
  const doctors = await Doctor.find().select('-password');
  res.json(doctors);
};

// ✅ Add a new doctor
export const addDoctor = async (req, res) => {
  const { name, email, password, phone, gender, age, speciality, experience } = req.body;

  const doctorExists = await Doctor.findOne({ email });
  if (doctorExists) {
    return res.status(400).json({ message: 'Doctor already exists' });
  }

  const doctor = await Doctor.create({
    name,
    email,
    password,
    phone,
    gender,
    age,
    speciality,
    experience,
  });

  res.status(201).json({
    message: 'Doctor added successfully',
    doctor: {
      _id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      speciality: doctor.speciality,
    },
  });
};

// ✅ Edit doctor details
export const editDoctor = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

  const { name, email, phone, gender, age, speciality, experience } = req.body;

  doctor.name = name || doctor.name;
  doctor.email = email || doctor.email;
  doctor.phone = phone || doctor.phone;
  doctor.gender = gender || doctor.gender;
  doctor.age = age || doctor.age;
  doctor.speciality = speciality || doctor.speciality;
  doctor.experience = experience || doctor.experience;

  const updatedDoctor = await doctor.save();
  res.json({ message: 'Doctor updated', doctor: updatedDoctor });
};

// ✅ Delete doctor
export const deleteDoctor = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

  await doctor.deleteOne();
  res.json({ message: 'Doctor deleted successfully' });
};

// ✅ Update doctor availability
export const updateDoctorAvailability = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

  doctor.isAvailable = req.body.isAvailable;
  await doctor.save();

  res.json({
    message: `Doctor is now ${doctor.isAvailable ? 'Available' : 'Unavailable'}`,
  });
};

// ✅ Dashboard Overview (basic version)
export const getOverview = async (req, res) => {
  const totalDoctors = await Doctor.countDocuments();
  const totalPatients = await User.countDocuments();
  const totalAppointments = await Appointment.countDocuments();

  res.json({
    totalDoctors,
    totalPatients,
    totalAppointments,
  });
};

// ✅ Reports (sample basic data)
export const getReports = async (req, res) => {
  const doctors = await Doctor.find().select('name experience');
  const appointments = await Appointment.find().select('status date');

  res.json({
    doctorsPerformance: doctors,
    appointmentsSummary: appointments,
  });
};
