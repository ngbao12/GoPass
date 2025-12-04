const mongoose = require('mongoose');

const classMemberSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'removed'],
    default: 'active',
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Ensure unique student per class
classMemberSchema.index({ classId: 1, studentId: 1 }, { unique: true });
classMemberSchema.index({ studentId: 1 });

module.exports = mongoose.model('ClassMember', classMemberSchema);
