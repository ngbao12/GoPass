import { httpClient } from "@/lib/http";
import { ApiResponse } from "./types";

// Backend Model Interfaces
export interface ExamModel {
  _id: string;
  title: string;
  description: string;
  subject: string;
  durationMinutes: number;
  totalPoints: number;
  createdBy: string;
  totalQuestions: number;
  readingPassages: any[];
  pdfFilePath?: string;
  pdfFileName?: string;
  isPublished: boolean;
  mode: string;
  createdAt: string;
  updatedAt: string;
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
  status: "in_progress" | "submitted" | "graded" | "late";
  objective_score: number;
  final_score: number;
  correctQuestionsCount: number;
}

// Frontend Types
export interface TeacherExam {
  id: string;
  title: string;
  subject: string;
  description: string;
  totalQuestions: number;
  duration: number;
  totalScore: number;
  status: "upcoming" | "active" | "completed";
  // Assignment info (if assigned)
  classId?: string;
  className?: string;
  startTime?: string;
  endTime?: string;
  // Stats
  totalStudents: number;
  totalSubmissions: number;
  averageScore: number;
  createdAt: string;
}

export interface ExamDetail extends TeacherExam {
  readingPassages: any[];
  assignments: ExamAssignment[];
  submissions: ExamSubmissionSummary[];
  statistics: ExamStatistics;
}

export interface ExamAssignment {
  id: string;
  classId: string;
  className: string;
  startTime: string;
  endTime: string;
  maxAttempts: number;
  // Stats for this assignment
  totalStudents: number;
  totalSubmissions: number;
  completionRate: number;
  averageScore: number;
}

export interface ExamSubmissionSummary {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  submittedAt: string;
  status: "in_progress" | "submitted" | "graded" | "late";
  score: number;
  maxScore: number;
  correctAnswers: number;
  totalQuestions: number;
}

export interface ExamStatistics {
  totalAssignments: number;
  totalStudents: number;
  totalSubmissions: number;
  completionRate: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  scoreDistribution: {
    range: string;
    count: number;
    percentage: number;
  }[];
}

export interface CreateExamData {
  title: string;
  description: string;
  subject: string;
  totalQuestions: string;
  duration: string; // minutes
  classIds?: string[];
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  showAnswers?: boolean;
}

export interface AssignExamData {
  examId: string;
  classIds: string[];
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  maxAttempts?: number;
}

export const examApi = {
  /**
   * Get teacher's exams with pagination
   * API: GET /api/exams/my-exams
   * Auth: Required (Teacher)
   */
  getMyExams: async (params?: {
    page?: number;
    limit?: number;
    subject?: string;
    isPublished?: boolean;
  }): Promise<ApiResponse<{ exams: ExamModel[]; pagination: any }>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.subject) queryParams.append("subject", params.subject);
    if (params?.isPublished !== undefined)
      queryParams.append("isPublished", params.isPublished.toString());

    const queryString = queryParams.toString();
    const response = await httpClient.get<
      ApiResponse<{ exams: ExamModel[]; pagination: any }>
    >(`/exams/my-exams${queryString ? `?${queryString}` : ""}`, {
      requiresAuth: true,
    });

    return response;
  },

  /**
   * Get all teacher's exams (legacy method for compatibility)
   * API: GET /api/exams/my-exams
   * Auth: Required (Teacher)
   */
  getExams: async (teacherId?: string): Promise<ApiResponse<TeacherExam[]>> => {
    const response = await examApi.getMyExams({ page: 1, limit: 100 });

    if (response.success) {
      const transformedData: TeacherExam[] = response.data.exams.map(
        (exam) => ({
          id: exam._id,
          title: exam.title,
          subject: exam.subject,
          description: exam.description,
          totalQuestions: exam.totalQuestions,
          duration: exam.durationMinutes,
          totalScore: exam.totalPoints,
          status: "upcoming",
          totalStudents: 0,
          totalSubmissions: 0,
          averageScore: 0,
          createdAt: exam.createdAt,
        })
      );

      return {
        success: true,
        data: transformedData,
      };
    }

    return { success: false, data: [] } as ApiResponse<TeacherExam[]>;
  },

  /**
   * Get exam detail
   * API: GET /api/exams/:examId
   * Auth: Required (Teacher)
   */
  getExamDetail: async (examId: string): Promise<ApiResponse<ExamDetail>> => {
    const response = await httpClient.get<any>(`/exams/${examId}`, {
      requiresAuth: true,
    });

    if (response.success) {
      const examData = response.data;

      const transformedDetail: ExamDetail = {
        id: examData._id,
        title: examData.title,
        subject: examData.subject,
        description: examData.description,
        totalQuestions: examData.totalQuestions,
        duration: examData.duration_min,
        totalScore: examData.total_score,
        status: "upcoming", // TODO: Calculate
        totalStudents: 0, // TODO: Calculate
        totalSubmissions: 0, // TODO: Calculate
        averageScore: 0, // TODO: Calculate
        createdAt: examData.created_at,
        readingPassages: examData.readingPassages || [],
        assignments:
          examData.assignments?.map((assignment: any) => ({
            id: assignment._id,
            classId: assignment.class_id,
            className: assignment.class?.class_name || "Unknown",
            startTime: assignment.start_time,
            endTime: assignment.end_time,
            maxAttempts: assignment.attempt_limit,
            totalStudents: assignment.class?.studentCount || 0,
            totalSubmissions: 0, // TODO: Calculate
            completionRate: 0, // TODO: Calculate
            averageScore: 0, // TODO: Calculate
          })) || [],
        submissions:
          examData.submissions?.map((submission: any) => ({
            id: submission._id,
            studentId: submission.student_user_id,
            studentName: submission.student?.full_name || "Unknown",
            className: submission.class?.class_name || "N/A",
            submittedAt: submission.submitted_at || submission.started_at,
            status: submission.status,
            score: submission.final_score,
            maxScore: examData.total_score,
            correctAnswers: submission.correctQuestionsCount,
            totalQuestions: examData.totalQuestions,
          })) || [],
        statistics: {
          totalAssignments: examData.assignments?.length || 0,
          totalStudents: 0, // TODO: Calculate
          totalSubmissions: examData.submissions?.length || 0,
          completionRate: 0, // TODO: Calculate
          averageScore: 0, // TODO: Calculate
          highestScore: 0, // TODO: Calculate
          lowestScore: 0, // TODO: Calculate
          scoreDistribution: [], // TODO: Calculate
        },
      };

      return {
        success: true,
        data: transformedDetail,
      };
    }

    return response as ApiResponse<ExamDetail>;
  },

  /**
   * Create new exam
   * API: POST /api/exams
   * Auth: Required (Teacher)
   */
  createExam: async (examData: any): Promise<ApiResponse<ExamModel>> => {
    return await httpClient.post<ApiResponse<ExamModel>>("/exams", examData, {
      requiresAuth: true,
    });
  },

  /**
   * Update exam
   * API: PUT /api/exams/:examId
   * Auth: Required (Teacher)
   */
  updateExam: async (
    examId: string,
    examData: any
  ): Promise<ApiResponse<ExamModel>> => {
    return await httpClient.put<ApiResponse<ExamModel>>(
      `/exams/${examId}`,
      examData,
      { requiresAuth: true }
    );
  },

  /**
   * Delete exam
   * API: DELETE /api/exams/:examId
   * Auth: Required (Teacher)
   */
  deleteExam: async (examId: string): Promise<ApiResponse<void>> => {
    return await httpClient.delete<ApiResponse<void>>(`/exams/${examId}`, {
      requiresAuth: true,
    });
  },

  /**
   * Assign exam to class
   * API: POST /api/exams/:examId/assign-to-class
   * Auth: Required (Teacher)
   */
  assignExamToClass: async (
    examId: string,
    assignmentData: any
  ): Promise<ApiResponse<any>> => {
    return await httpClient.post<ApiResponse<any>>(
      `/exams/${examId}/assign-to-class`,
      assignmentData,
      { requiresAuth: true }
    );
  },

  /**
   * Legacy assign method for compatibility
   */
  assignExam: async (
    assignmentData: AssignExamData
  ): Promise<ApiResponse<ExamAssignmentModel[]>> => {
    return await examApi.assignExamToClass(assignmentData.examId, {
      classId: assignmentData.classIds[0],
      startTime: `${assignmentData.startDate}T${assignmentData.startTime}:00Z`,
      endTime: `${assignmentData.endDate}T${assignmentData.endTime}:00Z`,
      maxAttempts: assignmentData.maxAttempts || 1,
    });
  },

  /**
   * Upload exam PDF file
   * API: POST /api/exams/upload-file
   * Auth: Required (Teacher)
   */
  uploadExamFile: async (file: File): Promise<ApiResponse<any>> => {
    const formData = new FormData();
    formData.append("file", file);
    return await httpClient.post<ApiResponse<any>>(
      "/exams/upload-file",
      formData,
      { requiresAuth: true }
    );
  },

  /**
   * Process PDF and create exam with questions
   * API: POST /api/exams/process-pdf
   * Auth: Required (Teacher)
   *
   * This endpoint:
   * 1. Takes the uploaded PDF file path
   * 2. Runs Python script to extract questions
   * 3. Creates exam with all questions in database
   * 4. Returns the complete exam with questions
   */
  processPdfToExam: async (pdfData: {
    pdfFilePath: string;
    pdfFileName: string;
    title: string;
    description?: string;
    subject?: string;
    durationMinutes?: number;
  }): Promise<
    ApiResponse<{
      exam: ExamModel;
      questions: any[];
      stats: {
        totalQuestions: number;
        totalPassages: number;
        totalPoints: number;
        clozeQuestions: number;
        readingQuestions: number;
      };
    }>
  > => {
    return await httpClient.post<ApiResponse<any>>(
      "/exams/process-pdf",
      pdfData,
      { requiresAuth: true }
    );
  },

  /**
   * Add questions to exam
   * API: POST /api/exams/:examId/questions
   * Auth: Required (Teacher)
   */
  addQuestionsToExam: async (
    examId: string,
    questions: any[]
  ): Promise<ApiResponse<any>> => {
    return await httpClient.post<ApiResponse<any>>(
      `/exams/${examId}/questions`,
      { questions },
      { requiresAuth: true }
    );
  },

  /**
   * Get exam submissions
   * API: GET /api/exams/:examId/submissions
   * Auth: Required (Teacher)
   */
  getExamSubmissions: async (
    examId: string
  ): Promise<ApiResponse<ExamSubmissionSummary[]>> => {
    const response = await httpClient.get<ApiResponse<ExamSubmissionModel[]>>(
      `/exams/${examId}/submissions`,
      { requiresAuth: true }
    );

    if (response.success) {
      // Transform to frontend format
      const transformedData: ExamSubmissionSummary[] = response.data.map(
        (submission) => ({
          id: submission._id,
          studentId: submission.student_user_id,
          studentName: "Unknown", // TODO: Join with User data
          className: "Unknown", // TODO: Join with Class data
          submittedAt: submission.submitted_at || submission.started_at,
          status: submission.status,
          score: submission.final_score,
          maxScore: 10, // TODO: Get from exam
          correctAnswers: submission.correctQuestionsCount,
          totalQuestions: 0, // TODO: Get from exam
        })
      );

      return {
        success: true,
        data: transformedData,
      };
    }

    return { success: false, data: [] } as ApiResponse<ExamSubmissionSummary[]>;
  },

  /**
   * Get exam statistics
   * API: GET /api/exams/:examId/statistics
   * Auth: Required (Teacher)
   */
  getExamStatistics: async (
    examId: string
  ): Promise<ApiResponse<ExamStatistics>> => {
    return await httpClient.get<ApiResponse<ExamStatistics>>(
      `/exams/${examId}/statistics`,
      { requiresAuth: true }
    );
  },
};
