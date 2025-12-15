const mongoose = require('mongoose');

const examSubmissionSchema = new mongoose.Schema({
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExamAssignment',
    required: false, // Optional theo spec
  },
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['in_progress', 'submitted', 'graded', 'late'],
    default: 'in_progress',
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  submittedAt: {
    type: Date,
  },
  
  // Điểm số
  totalScore: {
    type: Number,
    default: 0,
  },
  maxScore: {
    type: Number,
    default: 0,
  },
  
  // UI nhanh
  correctQuestionsCount: {
    type: Number,
    default: 0,
  },
  
  attemptNumber: {
    type: Number,
    default: 1,
  },
}, {
  timestamps: true,
});

// Index for queries
examSubmissionSchema.index({ assignmentId: 1, studentId: 1 });
examSubmissionSchema.index({ examId: 1 });
examSubmissionSchema.index({ studentId: 1 });
examSubmissionSchema.index({ status: 1 });

module.exports = mongoose.model('ExamSubmission', examSubmissionSchema);
