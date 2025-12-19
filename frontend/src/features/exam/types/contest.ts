// src/features/exam/types/contest.ts

export type ContestStatus = "upcoming" | "ongoing" | "ended" | "cancelled";

export interface Contest {
  _id: string;
  name: string;
  description?: string;
  startTime: string; // ISO datetime
  endTime: string; // ISO datetime
  ownerId: string;
  isPublic: boolean;
  status: ContestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ContestExam {
  _id: string;
  contestId: string;
  examId: string;
  order: number;
  weight: number; // Scoring weight
  exam?: import("./exam").Exam; // Populated exam data
  createdAt: string;
  updatedAt: string;
}

export interface ContestParticipation {
  _id: string;
  contestId: string;
  userId: string;
  enrolledAt: string;
  totalScore: number;
  rank?: number;
  completedExams: number;
  submissions?: import("./submission").ExamSubmission[];
}

export interface ContestWithDetails extends Contest {
  exams: ContestExam[];
  participantCount: number;
  myParticipation?: ContestParticipation;
}
