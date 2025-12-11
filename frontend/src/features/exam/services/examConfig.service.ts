// src/features/exam/services/examConfig.service.ts

/**
 * Service quản lý cấu hình exam theo từng môn học
 * Chứa business logic về structure, instructions, colors cho mỗi loại exam
 */

export interface ExamSection {
  id: number;
  title: string;
  description: string;
  color: "teal" | "blue" | "purple" | "orange";
  icon?: string;
}

export interface ExamInstruction {
  text: string;
  highlight?: boolean;
}

export interface ExamConfig {
  subject: string;
  examType: string;
  sections: ExamSection[];
  instructions: ExamInstruction[];
  timeWarning: string;
  headerGradient: string;
}

/**
 * Cấu hình cho các môn học khác nhau
 */
const EXAM_CONFIGS: Record<string, ExamConfig> = {
  "Toán Học": {
    subject: "Toán Học",
    examType: "Kỳ thi Tốt nghiệp THPT 2025",
    sections: [
      {
        id: 1,
        title: "Phần I: Trắc nghiệm",
        description: "12 câu hỏi trắc nghiệm (3 điểm)",
        color: "blue",
      },
      {
        id: 2,
        title: "Phần II: Đúng/Sai",
        description: "4 câu hỏi đúng/sai, mỗi câu 4 ý (4 điểm)",
        color: "purple",
      },
      {
        id: 3,
        title: "Phần III: Trả lời ngắn",
        description: "6 câu hỏi trả lời ngắn (3 điểm)",
        color: "orange",
      },
    ],
    instructions: [
      {
        text: "Không được sử dụng tài liệu. Mọi hành vi gian lận sẽ bị xử lý nghiêm khắc.",
      },
      {
        text: "Thời gian làm bài tiếp tục đếm ngược ngay cả khi bạn rời khỏi trang làm bài.",
      },
      {
        text: "Bạn có thể đánh dấu câu hỏi để xem lại sau bằng icon cờ.",
      },
      {
        text: "Sau khi nộp bài, bạn không thể chính sửa câu trả lời.",
        highlight: true,
      },
    ],
    timeWarning: 'Thời gian sẽ bắt đầu đếm ngược khi bạn bấm "Bắt đầu làm bài"',
    headerGradient: "bg-gradient-to-r from-teal-500 to-teal-600",
  },

  "Ngữ Văn": {
    subject: "Ngữ Văn",
    examType: "Kỳ thi Tốt nghiệp THPT 2025",
    sections: [
      {
        id: 1,
        title: "Phần I: Đọc hiểu",
        description: "5 câu hỏi ngữ văn về đoạn trích văn học (4 điểm)",
        color: "teal",
      },
      {
        id: 2,
        title: "Câu 2: Viết đoạn văn nghị luận",
        description: "Khoảng 200 chữ (2 điểm)",
        color: "teal",
      },
      {
        id: 3,
        title: "Câu 3: Viết bài văn nghị luận",
        description: "Khoảng 600 chữ (4 điểm)",
        color: "teal",
      },
    ],
    instructions: [
      {
        text: "Không được sử dụng tài liệu. Mọi hành vi gian lận sẽ bị xử lý nghiêm khắc.",
      },
      {
        text: "Thời gian làm bài tiếp tục đếm ngược ngay cả khi bạn rời khỏi trang làm bài.",
      },
      {
        text: "Bạn có thể đánh dấu câu hỏi để xem lại sau bằng icon cờ.",
      },
      {
        text: "Sau khi nộp bài, bạn không thể chính sửa câu trả lời.",
        highlight: true,
      },
    ],
    timeWarning: 'Thời gian sẽ bắt đầu đếm ngược khi bạn bấm "Bắt đầu làm bài"',
    headerGradient: "bg-gradient-to-r from-teal-500 to-teal-600",
  },

  "Tiếng Anh": {
    subject: "English",
    examType: "THPT National High School Graduation Examination 2025",
    sections: [
      {
        id: 1,
        title: "Part I: Independent Questions",
        description: "10 multiple choice questions (10 points)",
        color: "blue",
      },
      {
        id: 2,
        title: "Part II: Reading Comprehension",
        description: "2 passages with 16 questions (16 points)",
        color: "teal",
      },
      {
        id: 3,
        title: "Part III: Cloze Test",
        description: "1 passage with 5 fill-in-the-blank questions (5 points)",
        color: "orange",
      },
    ],
    instructions: [
      {
        text: "No materials allowed. Any cheating will result in disqualification.",
      },
      {
        text: "The timer continues counting down even if you leave the exam page.",
      },
      {
        text: "You can flag questions for review later using the flag icon.",
      },
      {
        text: "After submitting, you cannot edit your answers.",
        highlight: true,
      },
    ],
    timeWarning:
      'The timer will start counting down when you click "Bắt đầu làm bài"',
    headerGradient: "bg-gradient-to-r from-teal-500 to-teal-600",
  },
};

/**
 * Service class để quản lý exam configuration
 */
export class ExamConfigService {
  /**
   * Lấy config cho một môn học cụ thể
   */
  static getConfigBySubject(subject: string): ExamConfig | null {
    return EXAM_CONFIGS[subject] || null;
  }

  /**
   * Lấy màu badge cho section
   */
  static getSectionBadgeColor(color: ExamSection["color"]): string {
    const colorMap = {
      teal: "bg-teal-500 text-white",
      blue: "bg-blue-500 text-white",
      purple: "bg-purple-500 text-white",
      orange: "bg-orange-500 text-white",
    };
    return colorMap[color];
  }

  /**
   * Lấy màu border cho section card
   */
  static getSectionBorderColor(color: ExamSection["color"]): string {
    const colorMap = {
      teal: "border-teal-100 bg-teal-50",
      blue: "border-blue-100 bg-blue-50",
      purple: "border-purple-100 bg-purple-50",
      orange: "border-orange-100 bg-orange-50",
    };
    return colorMap[color];
  }

  /**
   * Format thời gian exam (phút -> text display)
   */
  static formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0 && mins > 0) {
      return `${hours} giờ ${mins} phút`;
    }
    if (hours > 0) {
      return `${hours} giờ`;
    }
    return `${minutes} phút`;
  }

  /**
   * Format số giây thành text hiển thị
   */
  static formatSeconds(seconds: number): string {
    return `${seconds} giây`;
  }

  /**
   * Validate exam có config hay không
   */
  static hasConfig(subject: string): boolean {
    return subject in EXAM_CONFIGS;
  }

  /**
   * Lấy default config nếu môn không có config riêng
   */
  static getDefaultConfig(subject: string): ExamConfig {
    return {
      subject: subject,
      examType: "Kỳ thi Tốt nghiệp THPT 2025",
      sections: [],
      instructions: [
        {
          text: "Không được sử dụng tài liệu. Mọi hành vi gian lận sẽ bị xử lý nghiêm khắc.",
        },
        {
          text: "Thời gian làm bài tiếp tục đếm ngược ngay cả khi bạn rời khỏi trang làm bài.",
        },
        {
          text: "Bạn có thể đánh dấu câu hỏi để xem lại sau bằng icon cờ.",
        },
        {
          text: "Sau khi nộp bài, bạn không thể chính sửa câu trả lời.",
          highlight: true,
        },
      ],
      timeWarning:
        'Thời gian sẽ bắt đầu đếm ngược khi bạn bấm "Bắt đầu làm bài"',
      headerGradient: "bg-gradient-to-r from-teal-500 to-teal-600",
    };
  }
}
