const mongoose = require('mongoose');

const manualGradingSchema = new mongoose.Schema({
  answerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExamAnswer',
    required: true,
  },
  graderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
  },
  gradedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Index for queries
manualGradingSchema.index({ answerId: 1 });
manualGradingSchema.index({ graderId: 1 });

module.exports = mongoose.model('ManualGrading', manualGradingSchema);
