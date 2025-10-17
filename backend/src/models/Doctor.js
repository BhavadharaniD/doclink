import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const doctorSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    age: { type: Number },
    gender: { type: String },
    speciality: { type: String, required: true },
    experience: { type: Number },
    availabilityStatus: { type: String, enum: ['Online', 'Offline'], default: 'Offline' },
    profilePic: { type: String, default: '' },
    role: { type: String, default: 'Doctor' }, // useful for RBAC
  },
  { timestamps: true }
);

// Password hashing
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password verification method
doctorSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
