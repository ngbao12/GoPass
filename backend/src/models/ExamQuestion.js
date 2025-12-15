const mongoose = require('mongoose');

const examQuestionSchema = new mongoose.Schema({
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true,
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  
  // Thứ tự câu hỏi trong đề
  order: {
    type: Number,
    required: true,
  },
  
  // Điểm tối đa của câu hỏi trong đề này
  maxScore: {
    type: Number,
    required: true,
    default: 1,
  },
  
  // Nhóm câu hỏi (phục vụ UI)
  section: {
    type: String,
    default: '',
  },
  
  // Đồng bộ frontend
  points: {
    type: Number,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Ensure unique question per exam and order
examQuestionSchema.index({ examId: 1, questionId: 1 }, { unique: true });
examQuestionSchema.index({ examId: 1, order: 1 });

module.exports = mongoose.model('ExamQuestion', examQuestionSchema);
