import User from '../models/User.js';
import generateToken from '../utils/jwt.js';
import jwt from 'jsonwebtoken';
import Appointment from '../models/Appointment.js';
// Register new user
export const registerUser = async (req, res) => {
  const { name, email, password, phone, age, gender, address } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const user = await User.create({ name, email, password, phone, age, gender, address });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) res.json(user);
  else res.status(404).json({ message: 'User not found' });
};

// Update user profile
export const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const { name, email, phone, age, gender, address, password } = req.body;
  user.name = name || user.name;
  user.email = email || user.email;
  user.phone = phone || user.phone;
  user.age = age || user.age;
  user.gender = gender || user.gender;
  user.address = address || user.address;
  if (password) user.password = password;

  const updatedUser = await user.save();
  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    age: updatedUser.age,
    gender: updatedUser.gender,
    address: updatedUser.address,
    token: generateToken(updatedUser._id),
  });
};
// Delete user
export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  // Only allow user to delete their own account
  if (req.user._id.toString() !== user._id.toString()) {
    return res.status(403).json({ message: 'You can only delete your own account' });
  }

  await user.remove();
  res.json({ message: 'User account deleted successfully' });
};

// Request password reset
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  // Generate a temporary reset token valid for 15 minutes
  const resetToken = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  // In production, send this token via email
  res.json({ message: 'Reset token generated', resetToken });
};

// Reset password
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token) return res.status(400).json({ message: 'Token is required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

// Upload/update profile picture
export const uploadProfilePic = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  // Only allow user to update their own profile pic
  if (req.user._id.toString() !== user._id.toString()) {
    return res.status(403).json({ message: 'You can only update your own profile' });
  }

  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  user.profilePic = req.file.path;
  await user.save();

  res.json({ message: 'Profile picture updated', profilePic: user.profilePic });
};


// GET /api/patients/doctor/:id/active
export const getActivePatients = async (req, res) => {
  try {
    const doctorId = req.params.id;

    // Fetch all appointments for this doctor
    const appointments = await Appointment.find({ doctorId }).populate('userId', 'name email isActive');

    // Filter unique active patients
    const activePatientsMap = {};
    appointments.forEach(app => {
      if (app.userId && app.userId.isActive) {
        activePatientsMap[app.userId._id] = app.userId;
      }
    });

    const activePatients = Object.values(activePatientsMap);

    res.status(200).json(activePatients);
  } catch (error) {
    console.error('getActivePatients error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
