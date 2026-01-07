export interface TeacherStats {
  totalClasses: number;
  totalStudents: number;
  totalExams: number;
  pendingRequests: number;
}

export interface TeacherActivity {
  id: string;
  type: "submission" | "join_request" | "exam_created" | "grade_updated";
  message: string;
  timestamp: string;
  className?: string;
  studentName?: string;
}