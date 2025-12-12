// src/features/exam/config/exam-layouts.config.ts

export type ExamLayoutType = "standard" | "reading-passage";

export interface ExamLayoutConfig {
  type: ExamLayoutType;
  sidebar: {
    width: string;
    position: "left";
  };
  content: {
    columns: 1 | 2;
    split?: [number, number];
  };
  navigation: {
    type: "question" | "section";
    buttonText: string;
  };
}

// 1. Layout Chuẩn (1 cột): Dùng cho Toán, Lý, Hóa, Independent Questions
const STANDARD_LAYOUT: ExamLayoutConfig = {
  type: "standard",
  sidebar: { width: "240px", position: "left" },
  content: { columns: 1 },
  navigation: { type: "question", buttonText: "Câu tiếp theo" },
};

// 2. Layout Đọc hiểu (2 cột): Dùng cho phần Đọc hiểu, Cloze Test
const SPLIT_LAYOUT: ExamLayoutConfig = {
  type: "reading-passage",
  sidebar: { width: "240px", position: "left" },
  content: {
    columns: 2,
    split: [45, 55],
  },
  navigation: { type: "question", buttonText: "Câu tiếp theo" },
};

export function getLayoutForQuestion(
  subject: string,
  section?: string
): ExamLayoutConfig {
  const subj = subject?.toLowerCase() || "";
  const sec = section?.toLowerCase() || "";

  // Logic nhận diện môn Ngữ Văn hoặc Tiếng Anh
  if (
    subj.includes("ngữ văn") ||
    subj.includes("tiếng anh") ||
    subj.includes("english")
  ) {
    // Các từ khóa kích hoạt chế độ 2 cột (Split View)
    const splitKeywords = [
      "đọc hiểu", // Văn/Anh
      "reading", // Anh
      "read", // Anh
      "cloze", // Anh (Bài đục lỗ)
      "fill", // Anh (Fill in blanks)
      "điền từ", // Văn/Anh
    ];

    if (splitKeywords.some((keyword) => sec.includes(keyword))) {
      return SPLIT_LAYOUT;
    }

    return STANDARD_LAYOUT;
  }

  return STANDARD_LAYOUT;
}
