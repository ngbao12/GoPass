const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student',
  },
  status: {
    type: String,
    enum: ['active', 'locked', 'pending'],
    default: 'active',
  },
  passwordHash: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  phone: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1, status: 1 });

module.exports = mongoose.model('User', userSchema);
