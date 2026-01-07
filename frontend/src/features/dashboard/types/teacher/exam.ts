// Dữ liệu thô từ database (bảng Exam)
export interface TeacherExam {
  _id: string;
  title: string;
  description?: string;
  subject: string;
  durationMinutes: number;
  mode: "practice" | "test" | "contest";
  shuffleQuestions: boolean;
  showResultsImmediately: boolean;
  createdBy: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  // Virtual fields
  questionCount?: number;
  assignedClassesCount?: number;
}

// Dữ liệu bài thi được assign cho lớp (bảng ExamAssignment)
export interface ExamAssignment {
  _id: string;
  examId: string;
  classId: string;
  startTime: string;
  endTime: string;
  shuffleQuestions: boolean;
  allowLateSubmission: boolean;
  maxAttempts: number;
  createdAt: string;
  updatedAt: string;
  // Populated fields
  exam?: TeacherExam;
  class?: {
    _id: string;
    name: string;
    code: string;
  };
  // Virtual fields
  submissionCount?: number;
  averageScore?: number;
}