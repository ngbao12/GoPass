/**
 * Teacher Class API Service
 * Handles all class-related API calls for teachers
 */

import { httpClient } from '@/lib/http';
import type {
  ApiResponse,
  TeacherClass,
  ClassModel,
  ClassDetail,
  ClassDetailResponse,
  CreateClassData,
  StudentStats,
} from './types';

/**
 * Class API Service
 * All endpoints require authentication
 */
export const classApi = {
  // GET /classes/my-classes - Get teacher's classes
  getClasses: async (): Promise<ApiResponse<TeacherClass[]>> => {
    try {
      const response = await httpClient.get<{ 
        success: boolean; 
        data: { classes: ClassModel[]; pagination: any } 
      }>('/classes/my-classes?isActive=true', { requiresAuth: true });
      
      if (!response.success) {
        return {
          success: false,
          data: [],
          error: 'Failed to fetch classes'
        };
      }

      // Fetch assignments for each class to get exam count
      const transformedDataWithAssignments = await Promise.all(
        response.data.classes.map(async (cls) => {
          const assignmentsResponse = await httpClient.get<{
            success: boolean;
            data: { assignments: any[] };
          }>(`/classes/${cls._id}/assignments`, { requiresAuth: true });
          
          const examCount = assignmentsResponse.success 
            ? (Array.isArray(assignmentsResponse.data) 
              ? assignmentsResponse.data.length 
              : (assignmentsResponse.data?.assignments?.length || 0))
            : 0;

          return {
            id: cls._id,
            name: cls.className,
            description: cls.description || '',
            classCode: cls.classCode,
            subject: "Toán", // TODO: Add to backend model
            grade: "Lớp 12", // TODO: Add to backend model
            studentCount: cls.studentCount || 0,
            examCount,
            createdAt: cls.createdAt,
          } as TeacherClass;
        })
      );
      
      return {
        success: true,
        data: transformedDataWithAssignments,
      };
    } catch (error: any) {
      console.error('Error fetching classes:', error);
      return {
        success: false,
        data: [],
        error: error.message || 'Failed to fetch classes'
      };
    }
  },

  // GET /classes/:id - Get class detail
  getClassDetail: async (classId: string): Promise<ApiResponse<ClassDetail>> => {
    try {
      const response = await httpClient.get<{
        success: boolean;
        data: {
          _id: string;
          className: string;
          classCode: string;
          teacherUserId: string;
          teacher: {
            _id: string;
            name: string;
            email: string;
            avatar?: string;
          };
          description?: string;
          requireApproval: boolean;
          isActive: boolean;
          studentCount: number;
          createdAt: string;
          updatedAt: string;
        };
      }>(`/classes/${classId}`, { requiresAuth: true });
      
      if (!response.success) {
        return {
          success: false,
          data: null as any,
          error: 'Failed to fetch class detail'
        };
      }

      const classData = response.data;
      
      // For now, we only have basic class info from backend
      // Members, joinRequests, and assignments would need separate API calls
      const transformedDetail: ClassDetail = {
        id: classData._id,
        className: classData.className,
        description: classData.description,
        classCode: classData.classCode,
        createdAt: classData.createdAt,
        teacher: {
          id: classData.teacher._id,
          full_name: classData.teacher.name,
          email: classData.teacher.email,
        },
        members: [], // TODO: Fetch from separate endpoint
        joinRequests: [], // TODO: Fetch from separate endpoint
        assignments: [], // TODO: Fetch from separate endpoint
        stats: {
          totalMembers: classData.studentCount || 0,
          pendingRequests: 0, // TODO: Calculate when we have join requests
          activeAssignments: 0, // TODO: Calculate when we have assignments
          averageScore: 0, // TODO: Calculate from submissions
        },
      };
      
      return {
        success: true,
        data: transformedDetail,
      };
    } catch (error: any) {
      console.error('Error fetching class detail:', error);
      return {
        success: false,
        data: null as any,
        error: error.message || 'Failed to fetch class detail'
      };
    }
  },

  // POST /classes - Create new class
  createClass: async (classData: CreateClassData): Promise<ApiResponse<ClassModel>> => {
    try {
      const payload = {
        className: classData.className,
        description: classData.description,
        classCode: classData.classCode,
        requireApproval: Boolean(classData.requireApproval),
        // teacherUserId is inferred from auth token in backend
      };
      
      const response = await httpClient.post<{
        success: boolean;
        data: ClassModel;
      }>('/classes', payload, { requiresAuth: true });
      
      if (!response.success) {
        return {
          success: false,
          data: null as any,
          error: 'Failed to create class'
        };
      }
      
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Error creating class:', error);
      return {
        success: false,
        data: null as any,
        error: error.message || 'Failed to create class'
      };
    }
  },

  // PUT /classes/:id - Update class
  updateClass: async (classId: string, updateData: Partial<CreateClassData>): Promise<ApiResponse<ClassModel>> => {
    try {
      const payload: any = {};
      
      if (updateData.className) payload.className = updateData.className;
      if (updateData.description) payload.description = updateData.description;
      if (updateData.classCode) payload.classCode = updateData.classCode;
      if (typeof updateData.requireApproval === 'boolean') payload.requireApproval = updateData.requireApproval;
      
      const response = await httpClient.put<{
        success: boolean;
        data: ClassModel;
      }>(`/classes/${classId}`, payload, { requiresAuth: true });
      
      if (!response.success) {
        return {
          success: false,
          data: null as any,
          error: 'Failed to update class'
        };
      }
      
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Error updating class:', error);
      return {
        success: false,
        data: null as any,
        error: error.message || 'Failed to update class'
      };
    }
  },

  // DELETE /classes/:id - Delete class
  deleteClass: async (classId: string): Promise<ApiResponse<void>> => {
    try {
      const response = await httpClient.delete<{
        success: boolean;
      }>(`/classes/${classId}`, { requiresAuth: true });
      
      if (!response.success) {
        return {
          success: false,
          data: undefined,
          error: 'Failed to delete class'
        };
      }
      
      return {
        success: true,
        data: undefined
      };
    } catch (error: any) {
      console.error('Error deleting class:', error);
      return {
        success: false,
        data: undefined,
        error: error.message || 'Failed to delete class'
      };
    }
  },

  // PUT /classes/:id/join-requests/:requestId - Approve join request
  approveJoinRequest: async (classId: string, requestId: string): Promise<ApiResponse<void>> => {
    try {
      const response = await httpClient.put<{
        success: boolean;
      }>(`/classes/${classId}/join-requests/${requestId}`, { action: 'approve' }, { requiresAuth: true });
      
      if (!response.success) {
        return {
          success: false,
          data: undefined,
          error: 'Failed to approve join request'
        };
      }
      
      return {
        success: true,
        data: undefined
      };
    } catch (error: any) {
      console.error('Error approving join request:', error);
      return {
        success: false,
        data: undefined,
        error: error.message || 'Failed to approve join request'
      };
    }
  },

  // PUT /classes/:id/join-requests/:requestId - Reject join request
  rejectJoinRequest: async (classId: string, requestId: string): Promise<ApiResponse<void>> => {
    try {
      const response = await httpClient.put<{
        success: boolean;
      }>(`/classes/${classId}/join-requests/${requestId}`, { action: 'reject' }, { requiresAuth: true });
      
      if (!response.success) {
        return {
          success: false,
          data: undefined,
          error: 'Failed to reject join request'
        };
      }
      
      return {
        success: true,
        data: undefined
      };
    } catch (error: any) {
      console.error('Error rejecting join request:', error);
      return {
        success: false,
        data: undefined,
        error: error.message || 'Failed to reject join request'
      };
    }
  },

  // DELETE /classes/:id/members/:memberId - Remove class member
  removeMember: async (classId: string, memberId: string): Promise<ApiResponse<void>> => {
    try {
      const response = await httpClient.delete<{
        success: boolean;
      }>(`/classes/${classId}/members/${memberId}`, { requiresAuth: true });
      
      if (!response.success) {
        return {
          success: false,
          data: undefined,
          error: 'Failed to remove member'
        };
      }
      
      return {
        success: true,
        data: undefined
      };
    } catch (error: any) {
      console.error('Error removing member:', error);
      return {
        success: false,
        data: undefined,
        error: error.message || 'Failed to remove member'
      };
    }
  },

  // GET /classes/:id/members - Get class members
  getClassMembers: async (classId: string): Promise<ApiResponse<any[]>> => {
    try {
      const response = await httpClient.get<{
        success: boolean;
        data: any[];
      }>(`/classes/${classId}/members`, { requiresAuth: true });
      
      if (!response.success) {
        return {
          success: false,
          data: [],
          error: 'Failed to fetch members'
        };
      }
      
      return {
        success: true,
        data: response.data || []
      };
    } catch (error: any) {
      console.error('Error fetching members:', error);
      return {
        success: false,
        data: [],
        error: error.message || 'Failed to fetch members'
      };
    }
  },

  // GET /classes/:id/join-requests - Get pending join requests
  getJoinRequests: async (classId: string): Promise<ApiResponse<any[]>> => {
    try {
      const response = await httpClient.get<{
        success: boolean;
        data: any[];
      }>(`/classes/${classId}/join-requests?status=pending`, { requiresAuth: true });
      
      if (!response.success) {
        return {
          success: false,
          data: [],
          error: 'Failed to fetch join requests'
        };
      }
      
      return {
        success: true,
        data: response.data || []
      };
    } catch (error: any) {
      console.error('Error fetching join requests:', error);
      return {
        success: false,
        data: [],
        error: error.message || 'Failed to fetch join requests'
      };
    }
  },

  // GET /classes/:id/assignments - Get class assignments
  getClassAssignments: async (classId: string): Promise<ApiResponse<any[]>> => {
    try {
      const response = await httpClient.get<{
        success: boolean;
        data: any[];
      }>(`/classes/${classId}/assignments`, { requiresAuth: true });
      
      if (!response.success) {
        return {
          success: false,
          data: [],
          error: 'Failed to fetch assignments'
        };
      }
      
      return {
        success: true,
        data: response.data || []
      };
    } catch (error: any) {
      console.error('Error fetching assignments:', error);
      return {
        success: false,
        data: [],
        error: error.message || 'Failed to fetch assignments'
      };
    }
  },

  // GET /classes/:classId/students/:studentId/stats - Get student stats in class
  getStudentStats: async (classId: string, studentId: string): Promise<ApiResponse<StudentStats>> => {
    try {
      const response = await httpClient.get<{
        success: boolean;
        data: StudentStats;
      }>(`/classes/${classId}/students/${studentId}/stats`, { requiresAuth: true });

      if (!response.success) {
        return {
          success: false,
          data: {
            totalAssignments: 0,
            completedAssignments: 0,
            averageScore: 0,
            recentResults: []
          },
          error: 'Failed to fetch student stats'
        };
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Error fetching student stats:', error);
      return {
        success: false,
        data: {
          totalAssignments: 0,
          completedAssignments: 0,
          averageScore: 0,
          recentResults: []
        },
        error: error.message || 'Failed to fetch student stats'
      };
    }
  },

  // DELETE /classes/:classId/assignments/:assignmentId - Delete class assignment
  deleteAssignment: async (classId: string, assignmentId: string): Promise<ApiResponse<void>> => {
    try {
      const response = await httpClient.delete<{ success: boolean; message?: string }>(
        `/classes/${classId}/assignments/${assignmentId}`,
        { requiresAuth: true }
      );

      if (!response.success) {
        return {
          success: false,
          data: undefined,
          error: response?.message || 'Failed to delete assignment'
        };
      }

      return { success: true, data: undefined };
    } catch (error: any) {
      console.error('Error deleting assignment:', error);
      return {
        success: false,
        data: undefined,
        error: error.message || 'Failed to delete assignment'
      };
    }
  },

  // PUT /classes/:classId/assignments/:assignmentId - Update class assignment
  updateAssignment: async (classId: string, assignmentId: string, updateData: any): Promise<ApiResponse<any>> => {
    try {
      const response = await httpClient.put<{ success: boolean; data: any; message?: string }>(
        `/classes/${classId}/assignments/${assignmentId}`,
        updateData,
        { requiresAuth: true }
      );

      if (!response.success) {
        return {
          success: false,
          data: null,
          error: response?.message || 'Failed to update assignment'
        };
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Error updating assignment:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to update assignment'
      };
    }
  },
};