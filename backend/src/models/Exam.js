const mongoose = require('mongoose');

// Reading Passage Sub-schema
const readingPassageSchema = new mongoose.Schema({
  id: {
    type: String, // VD: "passage-eng-01"
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String, // HTML
    required: true,
  },
}, { _id: false });

const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
  },
  subject: {
    type: String,
    required: true,
  },
  durationMinutes: {
    type: Number,
    required: true,
    default: 60,
  },
  mode: {
    type: String,
    enum: ['practice', 'test', 'contest'],
    default: 'practice',
  },
  shuffleQuestions: {
    type: Boolean,
    default: false,
  },
  showResultsImmediately: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  
  // Bổ sung theo change1.md
  readingPassages: [readingPassageSchema],
  totalQuestions: {
    type: Number,
    default: 0,
  },
  totalPoints: {
    type: Number,
    default: 10,
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

// Index for queries
examSchema.index({ createdBy: 1 });
examSchema.index({ subject: 1 });

module.exports = mongoose.model('Exam', examSchema);
