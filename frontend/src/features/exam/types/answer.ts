// src/features/exam/types/answer.ts
export interface AnswerData {
  questionId: string;
  answerText?: string;
  selectedOptions: string[];
  isAnswered: boolean;
  lastModified: Date;
}

export interface QuestionNavigationItem {
  questionId: string;
  order: number;
  isAnswered: boolean;
  isFlagged: boolean;
  isCurrentQuestion: boolean;
}
