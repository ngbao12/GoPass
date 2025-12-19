const mongoose = require("mongoose");
const { Schema } = mongoose;

const examQuestionSchema = new mongoose.Schema(
  {
    examId: {
    type: Schema.Types.ObjectId,
    ref: 'Exam',
    required: true,
  },
  questionId: {
    type: Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
 
  // 1. Thứ tự câu hỏi trong đề
  order: {
    type: Number,
    required: true,
  },


  // 2. Điểm số tối đa của câu hỏi TRONG ĐỀ THI NÀY
  // (Có thể khác với điểm mặc định của câu hỏi gốc)
  maxScore: {
    type: Number,
    required: true,
    default: 1,
  },


  // 3. FIX: Thêm Section để gom nhóm câu hỏi (Phục vụ Sidebar UI)
  // Ví dụ: "Phần I: Trắc nghiệm", "Phần II: Tự luận"
  section: {
    type: String,
    default: '',
  },

  // 4. FIX: Thêm points (Optional) để đồng bộ với Frontend Types
  // Đôi khi frontend dùng field 'points' thay vì 'maxScore'
  points: {
    type: Number,
    required: false
  }
  }
);

// Ensure unique question per exam and order
examQuestionSchema.index({ examId: 1, questionId: 1 }, { unique: true });
examQuestionSchema.index({ examId: 1, order: 1 });

module.exports = mongoose.model("ExamQuestion", examQuestionSchema);
