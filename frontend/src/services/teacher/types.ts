/**
 * Teacher Service Types
 * Separates API models, request/response types, and display types
 */

// ============================================
// Generic API Response Type
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// ============================================
// Backend Model Interfaces (from MongoDB)
export interface ClassModel {
  _id: string;
  className: string;
  classCode: string;
  teacherUserId: string;
  description?: string;
  requireApproval: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  studentCount?: number; // Populated by backend
}

export interface ClassMemberModel {
  _id: string;
  class_id: string;
  student_user_id: string;
  joined_date: string;
  status: 'pending' | 'approved';
}

export interface ClassJoinRequestModel {
  _id: string;
  class_id: string;
  student_user_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  requested_at: string;
  processed_at?: string;
}

export interface UserModel {
  _id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  status: 'active' | 'inactive';
  created_at: string;
  updated_at?: string;
}

export interface ExamModel {
  _id: string;
  title: string;
  description: string;
  subject: string;
  duration_min: number;
  total_score: number;
  created_by: string;
  totalQuestions: number;
  readingPassages: any[];
  created_at: string;
  updated_at: string;
}

export interface ExamAssignmentModel {
  _id: string;
  exam_id: string;
  class_id: string;
  start_time: string;
  end_time: string;
  attempt_limit: number;
  created_at: string;
}

export interface ExamSubmissionModel {
  _id: string;
  exam_id: string;
  student_user_id: string;
  class_id?: string;
  started_at: string;
  submitted_at?: string;
  status: 'in_progress' | 'submitted' | 'graded' | 'late';
  objective_score: number;
  final_score: number;
  correctQuestionsCount: number;
}

// ============================================
// API Request/Response Types
export interface ClassDetailResponse {
  class: ClassModel;
  teacher: UserModel;
  members: (ClassMemberModel & { student: UserModel })[];
  joinRequests: (ClassJoinRequestModel & { student: UserModel })[];
  assignments: any[];
}

export interface CreateClassRequest {
  className: string;
  description: string;
  classCode?: string;
}

export interface UpdateClassRequest {
  className?: string;
  description?: string;
}

// ============================================
// Frontend Input Types
// ============================================
export interface CreateClassData {
  className: string;
  description?: string;
  classCode: string;
  requireApproval?: boolean;
}

// ============================================
// Frontend Display Types
export interface TeacherClass {
  id: string;
  name: string;
  description: string;
  classCode: string;
  subject: string;
  grade: string;
  studentCount: number;
  examCount: number;
  createdAt: string;
}

export interface ClassDetail {
  id: string;
  className: string;
  description?: string;
  classCode: string;
  createdAt: string;
  teacher: {
    id: string;
    full_name: string;
    email: string;
  };
  members: ClassMember[];
  joinRequests: ClassJoinRequest[];
  assignments: ExamAssignment[];
  stats: ClassStats;
}

export interface ClassMember {
  id: string;
  class_id: string;
  student_user_id: string;
  joined_date: string;
  status: 'pending' | 'approved';
  student: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface ClassJoinRequest {
  id: string;
  class_id: string;
  student_user_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  requested_at: string;
  processed_at?: string;
  student: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface ExamAssignment {
  id: string;
  exam_id: string;
  class_id: string;
  start_time: string;
  end_time: string;
  attempt_limit: number;
  created_at: string;
  exam: {
    id: string;
    title: string;
    description: string;
    subject: string;
    duration_min: number;
    total_score: number;
  };
}

export interface ClassStats {
  totalMembers: number;
  pendingRequests: number;
  activeAssignments: number;
  averageScore: number;
}
