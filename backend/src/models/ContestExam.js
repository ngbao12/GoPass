const mongoose = require("mongoose");
const contestExamSchema = new mongoose.Schema({
  contestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contest',
    required: true,
  },
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true,
  },
  order: {
    type: Number,
    required: true, // Để sắp xếp môn 1, môn 2...
  },
  weight: {
    type: Number,
    default: 1, // Hệ số điểm (ví dụ Toán nhân đôi thì để 2)
  },
}, {
  timestamps: true,
});

// Index for queries
contestExamSchema.index({ contestId: 1, examId: 1 }, { unique: true });
contestExamSchema.index({ contestId: 1, order: 1 });

module.exports = mongoose.model("ContestExam", contestExamSchema);
