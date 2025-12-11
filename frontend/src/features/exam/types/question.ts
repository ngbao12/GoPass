// src/features/exam/types/question.ts
export type QuestionType =
  | "multiple_choice"
  | "essay"
  | "short_answer"
  | "true_false";
export type DifficultyLevel = "easy" | "medium" | "hard";

export interface QuestionOption {
  text: string;
  isCorrect?: boolean; // Only visible to teachers/admin
}

export interface Question {
  _id: string;
  type: QuestionType;
  content: string;
  options: QuestionOption[];
  correctAnswer?: string;
  difficulty: DifficultyLevel;
  subject: string;
  tags: string[];
  points: number;
  createdBy: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExamQuestion {
  _id: string;
  examId: string;
  questionId: string;
  order: number;
  maxScore: number;
  question?: Question;
  createdAt: string;
}
