// Re-export actual contest types from exam feature
export type {
  Contest,
  ContestStatus,
  ContestExam,
  ContestParticipation,
  ContestWithDetails,
} from '@/features/exam/types';

// Dashboard-specific form data for creating contests
export interface ContestFormData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  subjects: string[];
  isPublic: boolean;
}

export interface Subject {
  id: string;
  name: string;
  isSelected: boolean;
}
