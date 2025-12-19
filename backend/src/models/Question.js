const mongoose = require("mongoose");
const { Schema } = mongoose; // THÊM DÒNG NÀY
const questionSchema = new mongoose.Schema(
// 1. Loại câu hỏi
{
  type: {
    type: String,
    enum: ['multiple_choice', 'essay', 'short_answer', 'true_false'],
    required: true,
  },


  // 2. Nội dung câu hỏi
  content: {
    type: String,
    required: true,
  },


  // 3. Các lựa chọn (FIX: Đồng bộ với Frontend QuestionOption)
  options: [{
    _id: false, // Tắt tự động tạo _id của Mongo để dùng id tùy chỉnh (A, B, C)
    id: {
      type: String,
      required: true
    }, // Ví dụ: "A", "B", "C", "D"
    content: {
      type: String,
      required: true
    }, // Thay vì 'text' như cũ, Frontend dùng 'content'
    isCorrect: {
      type: Boolean,
      default: false
    }
  }],


  // 4. Đáp án đúng (FIX: Dùng Mixed để lưu được cả String và Object)
  // - Trắc nghiệm: "A"
  // - Đúng/Sai: { "a": true, "b": false }
  // - Tự luận: "Gợi ý đáp án..."
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },


  // 5. Lời giải chi tiết (FIX: Bổ sung cho chế độ Review)
  explanation: {
    type: String,
    required: false,
  },


  // 6. Liên kết bài đọc (FIX: Bổ sung cho Reading/Cloze)
  // Có thể là ObjectId nếu bạn tách bảng Passage, hoặc String ID như mock data
  linkedPassageId: {
    type: String,
    required: false,
    index: true
  },


  // 7. Hình ảnh đính kèm (FIX: Bổ sung)
  image: {
    url: String,
    caption: String,
    position: {
      type: String,
      enum: ['top', 'bottom'],
      default: 'top'
    }
  },
  // 8. Dữ liệu bảng biểu (FIX: Bổ sung cho môn Toán/Địa)
  tableData: {
    headers: [String], // ["Điểm số", "Số lượng"]
    rows: [[String]]   // [["5", "2"], ["6", "5"]]
  },


  // --- CÁC TRƯỜNG CƠ BẢN GIỮ NGUYÊN ---
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  subject: {
    type: String,
    required: true,
    index: true // Thêm index để lọc nhanh
  },
  tags: [{
    type: String,
  }], // Dùng tags để phân loại layout.
  points: {
    type: Number,
    default: 1,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
}
)

// Index for searching
questionSchema.index({ subject: 1, difficulty: 1 });
questionSchema.index({ tags: 1 });
questionSchema.index({ createdBy: 1 });

module.exports = mongoose.model("Question", questionSchema);
