// src/features/exam/types/question.ts

export type QuestionType =
  | "multiple_choice"
  | "essay"
  | "short_answer"
  | "true_false";

export type DifficultyLevel = "easy" | "medium" | "hard";

export interface QuestionOption {
  id: string;
  content: string;
  isCorrect?: boolean; //Optional field to indicate correct MPC answer
}

export interface Question {
  _id: string;
  type: QuestionType;
  content: string;
  options?: QuestionOption[];
  // Flexible field
  correctAnswer?: string | Record<string, any>;
  difficulty: DifficultyLevel;
  subject: string;
  tags: string[];
  points: number;
  createdBy: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;

  // 1. Hình ảnh minh họa (Đồ thị, Hình học...)
  image?: {
    url: string;
    caption?: string;
    position?: "top" | "bottom"; // Vị trí hiển thị hình ảnh
  };

  // 2. Bảng dữ liệu (Thống kê, Địa lý...)
  tableData?: {
    headers: string[];
    rows: string[][];
  };
}

export interface ExamQuestion {
  _id: string;
  examId: string;
  questionId: string;
  order: number;
  maxScore: number;
  section?: string;
  points?: number;
  question?: Question;
  createdAt: string;
}
