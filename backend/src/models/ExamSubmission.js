const mongoose = require("mongoose");
const examSubmissionSchema = new mongoose.Schema({
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    default: null,
  },
  contestId: { // Link tới Contest để biết bài này thuộc cuộc thi nào
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contest',
    default: null, // Có thể null nếu là thi thử tự do
  },
  studentUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  startedAt: {
    type: Date,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  durationSeconds: { // Thời gian làm bài thực tế
    type: Number,
    default: 0
  },
  totalScore: {
    type: Number,
    default: 0,
  },
  maxScore: {
    type: Number,
    default: 10,
  },
  status: {
    type: String,
    enum: ['in_progress', 'submitted', 'graded'],
    default: 'submitted',
  },
  // ✅ QUAN TRỌNG: Lưu chi tiết đáp án để Review
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    selectedOptions: [String], // Ví dụ: ["A"] hoặc ["A", "C"]
    answerText: String,        // Nếu là tự luận
    isCorrect: Boolean,
    score: Number,
    feedback: String           // Lời giải thích cho câu này (nếu có)
  }]
}, {
  timestamps: true,
});


// Index for queries
examSubmissionSchema.index({ examId: 1, studentUserId: 1 });
examSubmissionSchema.index({ examId: 1 });
examSubmissionSchema.index({ studentUserId: 1 });
examSubmissionSchema.index({ status: 1 });

module.exports = mongoose.model("ExamSubmission", examSubmissionSchema);
