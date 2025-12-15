const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  // 1. Loại câu hỏi
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

  // 3. Các lựa chọn (đồng bộ với Frontend)
  options: [{
    _id: false,
    id: {
      type: String, // "A", "B", "C", "D"
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
  }],

  // 4. Đáp án đúng (linh hoạt)
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed,
  },

  // 5. Lời giải chi tiết
  explanation: {
    type: String,
  },

  // 6. Liên kết bài đọc
  linkedPassageId: {
    type: String,
    index: true,
  },

  // 7. Hình ảnh đính kèm
  image: {
    url: String,
    caption: String,
    position: {
      type: String,
      enum: ['top', 'bottom'],
      default: 'top',
    },
  },

  // 8. Dữ liệu bảng biểu
  tableData: {
    headers: [String],
    rows: [[String]],
  },

  // Các trường giữ nguyên
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  subject: {
    type: String,
    required: true,
    index: true,
  },
  tags: [{
    type: String,
  }],
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

// Index for searching
questionSchema.index({ subject: 1, difficulty: 1 });
questionSchema.index({ tags: 1 });
questionSchema.index({ createdBy: 1 });
questionSchema.index({ linkedPassageId: 1 });

module.exports = mongoose.model('Question', questionSchema);
