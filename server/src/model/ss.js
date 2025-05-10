const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'faculty'], required: true }
});

// Hash the password before saving it
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const login = mongoose.model('login', userSchema);


//faculty dashboard

const mentorRequestSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'login' },
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'login' },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  feedback: { type: String, default: '' },
});

const  mentorRequest = mongoose.model('mentorRequest', mentorRequestSchema);


module.exports = { login, mentorRequest };

