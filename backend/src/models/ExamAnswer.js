const mongoose = require('mongoose');

const examAnswerSchema = new mongoose.Schema({
  submissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExamSubmission',
    required: true,
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  
  // Nội dung trả lời
  answerText: {
    type: String,
    default: '',
  },
  
  // Trắc nghiệm / Đúng sai
  selectedOptions: [{
    type: String,
  }],
  
  // Chấm điểm
  score: {
    type: Number,
    default: 0,
  },
  maxScore: {
    type: Number,
    required: true,
    default: 0,
  },
  
  feedback: {
    type: String,
  },
  isAutoGraded: {
    type: Boolean,
    default: false,
  },
  isManuallyGraded: {
    type: Boolean,
    default: false,
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
examAnswerSchema.index({ submissionId: 1, questionId: 1 }, { unique: true });
examAnswerSchema.index({ submissionId: 1 });

module.exports = mongoose.model('ExamAnswer', examAnswerSchema);
