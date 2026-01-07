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
      }>('/classes/my-classes', { requiresAuth: true });
      
      if (!response.success) {
        return {
          success: false,
          data: [],
          error: 'Failed to fetch classes'
        };
      }

      const transformedData: TeacherClass[] = response.data.classes.map(cls => ({
        id: cls._id,
        name: cls.className,
        description: cls.description || '',
        classCode: cls.classCode,
        subject: "Toán", // TODO: Add to backend model
        grade: "Lớp 12", // TODO: Add to backend model
        studentCount: cls.studentCount || 0,
        examCount: 0, // TODO: Calculate from assignments
        createdAt: cls.createdAt,
      }));
      
      return {
        success: true,
        data: transformedData,
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
        data: ClassDetailResponse;
      }>(`/classes/${classId}`, { requiresAuth: true });
      
      if (!response.success) {
        return {
          success: false,
          data: null as any,
          error: 'Failed to fetch class detail'
        };
      }

      const { class: classData, teacher, members, joinRequests, assignments } = response.data;
      
      const transformedDetail: ClassDetail = {
        id: classData._id,
        className: classData.className,
        description: classData.description,
        classCode: classData.classCode,
        createdAt: classData.createdAt,
        teacher: {
          id: teacher._id,
          full_name: teacher.full_name,
          email: teacher.email,
        },
        members: members.map(member => ({
          id: member._id,
          class_id: member.class_id,
          student_user_id: member.student_user_id,
          joined_date: member.joined_date,
          status: member.status,
          student: {
            id: member.student._id,
            full_name: member.student.full_name,
            email: member.student.email,
          },
        })),
        joinRequests: joinRequests.map(request => ({
          id: request._id,
          class_id: request.class_id,
          student_user_id: request.student_user_id,
          status: request.status,
          requested_at: request.requested_at,
          processed_at: request.processed_at,
          student: {
            id: request.student._id,
            full_name: request.student.full_name,
            email: request.student.email,
          },
        })),
        assignments: assignments || [],
        stats: {
          totalMembers: members.filter(m => m.status === 'approved').length,
          pendingRequests: joinRequests.filter(r => r.status === 'pending').length,
          activeAssignments: assignments?.length || 0,
          averageScore: 8.5, // TODO: Calculate from submissions
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
        className: classData.class_name,
        description: classData.description,
        classCode: `${classData.grade.replace('Lớp ', '')}-${Date.now()}`, // Auto generate
        // teacherUserId will be set from auth token in backend
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
      
      if (updateData.class_name) payload.className = updateData.class_name;
      if (updateData.description) payload.description = updateData.description;
      
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
      }>(`/classes/${classId}/join-requests/${requestId}`, { status: 'accepted' }, { requiresAuth: true });
      
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
      }>(`/classes/${classId}/join-requests/${requestId}`, { status: 'rejected' }, { requiresAuth: true });
      
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
};