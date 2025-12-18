// Re-export everything from exam/types - use the same types everywhere
export type {
  QuestionType,
  DifficultyLevel,
  Question,
  QuestionOption,
  ExamQuestion,
} from '@/features/exam/types';

import type { QuestionType } from '@/features/exam/types';

// Draft state for question creation UI
export interface QuestionDraft {
  step: number;
  type?: QuestionType;
  passage?: 'none' | 'existing' | 'new';
  passageId?: string;
  formData?: any;
  timestamp: number;
}
