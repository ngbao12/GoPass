const mongoose = require("mongoose");
const { Schema } = mongoose;

const examAnswerSchema = new Schema({
  // 1. Tham chiếu
  submissionId: {
    type: Schema.Types.ObjectId,
    ref: 'ExamSubmission',
    required: true,
  },
  questionId: {
    type: Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },


  // 2. Nội dung trả lời (Khớp với Typescript Interface)
  // Dành cho Tự luận / Điền từ
  answerText: {
    type: String,
    default: '',
  },
  // Dành cho Trắc nghiệm / Đúng Sai (Lưu mảng ID các lựa chọn)
  selectedOptions: [{
    type: String,
    default: [] // FIX: Luôn trả về mảng rỗng để frontend không bị lỗi .map()
  }],


  // 3. Kết quả chấm
  score: {
    type: Number,
    default: 0,
  },
  // Lưu lại maxScore tại thời điểm thi (đề phòng câu hỏi gốc bị sửa điểm sau này)
  maxScore: {
    type: Number,
    required: true, // NÊN bắt buộc để tính % điểm chính xác
    default: 0
  },
 
  // 4. Phản hồi & Trạng thái
  feedback: {
    type: String, // Nhận xét của giáo viên hoặc AI
  },
  isAutoGraded: {
    type: Boolean,
    default: false,
  },
  isManuallyGraded: {
    type: Boolean,
    default: false,
  },


}, {
  timestamps: true,
});


// Index for queries
examAnswerSchema.index({ submissionId: 1, questionId: 1 }, { unique: true });
examAnswerSchema.index({ submissionId: 1 });

module.exports = mongoose.model("ExamAnswer", examAnswerSchema);
