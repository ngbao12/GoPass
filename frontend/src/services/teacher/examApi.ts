/**
 * Teacher Exam API Service
 * Handles all exam-related API calls for teachers
 */

import { httpClient } from '@/lib/http';
import type {
  ApiResponse,
  ExamModel,
  ExamAssignmentModel,
  ExamSubmissionModel,
} from './types';

// ============================================
// Frontend Display Types
// ============================================
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
    status: 'in_progress' | 'submitted' | 'graded' | 'late';
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

// ============================================
// API Service
// ============================================
export const examApi = {
  // GET /exams - Get teacher's exams
  getExams: async (): Promise<ApiResponse<TeacherExam[]>> => {
    try {
      const response = await httpClient.get<{
        success: boolean;
        data: ExamModel[];
      }>('/exams', { requiresAuth: true });

      if (!response.success) {
        return {
          success: false,
          data: [],
          error: 'Failed to fetch exams'
        };
      }

      const transformedData: TeacherExam[] = response.data.map(exam => ({
        id: exam._id,
        title: exam.title,
        subject: exam.subject,
        description: exam.description,
        totalQuestions: exam.totalQuestions,
        duration: exam.duration_min,
        totalScore: exam.total_score,
        status: "upcoming", // TODO: Calculate based on assignments
        totalStudents: 0, // TODO: Calculate from assignments
        totalSubmissions: 0, // TODO: Calculate from submissions
        averageScore: 0, // TODO: Calculate from submissions
        createdAt: exam.created_at,
      }));

      return {
        success: true,
        data: transformedData,
      };
    } catch (error: any) {
      console.error('Error fetching exams:', error);
      return {
        success: false,
        data: [],
        error: error.message || 'Failed to fetch exams'
      };
    }
  },

  // GET /exams/:id - Get exam detail
  getExamDetail: async (examId: string): Promise<ApiResponse<ExamDetail>> => {
    try {
      const response = await httpClient.get<{
        success: boolean;
        data: any;
      }>(`/exams/${examId}`, { requiresAuth: true });

      if (!response.success) {
        return {
          success: false,
          data: null as any,
          error: 'Failed to fetch exam detail'
        };
      }

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
        assignments: examData.assignments?.map((assignment: any) => ({
          id: assignment._id,
          classId: assignment.class_id,
          className: assignment.class?.class_name || 'Unknown',
          startTime: assignment.start_time,
          endTime: assignment.end_time,
          maxAttempts: assignment.attempt_limit,
          totalStudents: assignment.class?.studentCount || 0,
          totalSubmissions: 0, // TODO: Calculate
          completionRate: 0, // TODO: Calculate
          averageScore: 0, // TODO: Calculate
        })) || [],
        submissions: examData.submissions?.map((submission: any) => ({
          id: submission._id,
          studentId: submission.student_user_id,
          studentName: submission.student?.full_name || 'Unknown',
          className: submission.class?.class_name || 'N/A',
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
    } catch (error: any) {
      console.error('Error fetching exam detail:', error);
      return {
        success: false,
        data: null as any,
        error: error.message || 'Failed to fetch exam detail'
      };
    }
  },

  // POST /exams - Create new exam
  createExam: async (examData: CreateExamData): Promise<ApiResponse<ExamModel>> => {
    try {
      const payload = {
        title: examData.title,
        description: examData.description,
        subject: examData.subject,
        duration_min: parseInt(examData.duration),
        total_score: 10.0, // Default
        totalQuestions: parseInt(examData.totalQuestions),
        readingPassages: [],
        // created_by will be set by backend from auth token
      };

      const response = await httpClient.post<{
        success: boolean;
        data: ExamModel;
      }>('/exams', payload, { requiresAuth: true });

      if (!response.success) {
        return {
          success: false,
          data: null as any,
          error: 'Failed to create exam'
        };
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Error creating exam:', error);
      return {
        success: false,
        data: null as any,
        error: error.message || 'Failed to create exam'
      };
    }
  },

  // PUT /exams/:id - Update exam
  updateExam: async (examId: string, examData: Partial<CreateExamData>): Promise<ApiResponse<ExamModel>> => {
    try {
      const payload: any = {};

      if (examData.title) payload.title = examData.title;
      if (examData.description) payload.description = examData.description;
      if (examData.subject) payload.subject = examData.subject;
      if (examData.duration) payload.duration_min = parseInt(examData.duration);
      if (examData.totalQuestions) payload.totalQuestions = parseInt(examData.totalQuestions);

      const response = await httpClient.put<{
        success: boolean;
        data: ExamModel;
      }>(`/exams/${examId}`, payload, { requiresAuth: true });

      if (!response.success) {
        return {
          success: false,
          data: null as any,
          error: 'Failed to update exam'
        };
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Error updating exam:', error);
      return {
        success: false,
        data: null as any,
        error: error.message || 'Failed to update exam'
      };
    }
  },

  // DELETE /exams/:id - Delete exam
  deleteExam: async (examId: string): Promise<ApiResponse<void>> => {
    try {
      const response = await httpClient.delete<{
        success: boolean;
      }>(`/exams/${examId}`, { requiresAuth: true });

      if (!response.success) {
        return {
          success: false,
          data: undefined,
          error: 'Failed to delete exam'
        };
      }

      return {
        success: true,
        data: undefined
      };
    } catch (error: any) {
      console.error('Error deleting exam:', error);
      return {
        success: false,
        data: undefined,
        error: error.message || 'Failed to delete exam'
      };
    }
  },

  // POST /exams/:id/assign - Assign exam to classes
  assignExam: async (assignmentData: AssignExamData): Promise<ApiResponse<ExamAssignmentModel[]>> => {
    try {
      const assignments = assignmentData.classIds.map(classId => ({
        exam_id: assignmentData.examId,
        class_id: classId,
        start_time: `${assignmentData.startDate}T${assignmentData.startTime}:00Z`,
        end_time: `${assignmentData.endDate}T${assignmentData.endTime}:00Z`,
        attempt_limit: assignmentData.maxAttempts || 1,
      }));

      const response = await httpClient.post<{
        success: boolean;
        data: ExamAssignmentModel[];
      }>(`/exams/${assignmentData.examId}/assign`, { assignments }, { requiresAuth: true });

      if (!response.success) {
        return {
          success: false,
          data: [],
          error: 'Failed to assign exam'
        };
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Error assigning exam:', error);
      return {
        success: false,
        data: [],
        error: error.message || 'Failed to assign exam'
      };
    }
  },

  // GET /exams/:id/submissions - Get exam submissions
  getExamSubmissions: async (examId: string): Promise<ApiResponse<ExamSubmissionSummary[]>> => {
    try {
      const response = await httpClient.get<{
        success: boolean;
        data: ExamSubmissionModel[];
      }>(`/exams/${examId}/submissions`, { requiresAuth: true });

      if (!response.success) {
        return {
          success: false,
          data: [],
          error: 'Failed to fetch submissions'
        };
      }

      const transformedData: ExamSubmissionSummary[] = response.data.map(submission => ({
        id: submission._id,
        studentId: submission.student_user_id,
        studentName: 'Unknown', // TODO: Join with User data
        className: 'Unknown', // TODO: Join with Class data
        submittedAt: submission.submitted_at || submission.started_at,
        status: submission.status,
        score: submission.final_score,
        maxScore: 10, // TODO: Get from exam
        correctAnswers: submission.correctQuestionsCount,
        totalQuestions: 0, // TODO: Get from exam
      }));

      return {
        success: true,
        data: transformedData
      };
    } catch (error: any) {
      console.error('Error fetching submissions:', error);
      return {
        success: false,
        data: [],
        error: error.message || 'Failed to fetch submissions'
      };
    }
  },

  // GET /exams/:id/statistics - Get exam statistics
  getExamStatistics: async (examId: string): Promise<ApiResponse<ExamStatistics>> => {
    try {
      const response = await httpClient.get<{
        success: boolean;
        data: ExamStatistics;
      }>(`/exams/${examId}/statistics`, { requiresAuth: true });

      if (!response.success) {
        return {
          success: false,
          data: null as any,
          error: 'Failed to fetch statistics'
        };
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Error fetching statistics:', error);
      return {
        success: false,
        data: null as any,
        error: error.message || 'Failed to fetch statistics'
      };
    }
  },
};