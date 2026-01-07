// Dữ liệu thô từ database (bảng Class)
export interface TeacherClass {
  _id: string;
  name: string;
  code: string;
  teacherId: string;
  description?: string;
  requireApproval: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Virtual fields từ aggregation
  studentCount?: number;
  examCount?: number;
  pendingRequests?: number;
}

// Dùng cho overview card trong dashboard
export interface QuickClassInfo {
  id: string;
  name: string;
  code: string;
  subject: string;
  studentCount: number;
  pendingRequests: number;
}

// Member trong lớp học (bảng ClassMember)
export interface ClassMember {
  _id: string;
  classId: string;
  studentId: string;
  status: "active" | "removed";
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
  // Populated fields
  student?: {
    _id: string;
    name: string;
    email: string;
  };
}

// Join request (bảng ClassJoinRequest)
export interface ClassJoinRequest {
  _id: string;
  classId: string;
  studentId: string;
  status: "pending" | "accepted" | "rejected";
  requestedAt: string;
  processedAt?: string;
  processedBy?: string;
  createdAt: string;
  updatedAt: string;
  // Populated fields
  student?: {
    _id: string;
    name: string;
    email: string;
  };
}