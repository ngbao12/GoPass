export type UserRole = 'admin' | 'student' | 'teacher';

// Re-export actual exam types instead of duplicating
export type { Exam, ExamMode, ExamStatus, ExamAssignment, ExamWithDetails } from '@/features/exam/types';

import type { Exam } from '@/features/exam/types';

// Dashboard-specific stats
export interface DashboardStats {
  totalExams: number;
  contestExams: number;
  publicExams: number;
  totalParticipants: number;
}

export interface DashboardData {
  stats: DashboardStats;
  exams: Exam[];
}
