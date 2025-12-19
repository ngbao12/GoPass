import { StudentStats, ClassSummary } from "@/features/dashboard/types/student/";
import { httpClient } from "@/lib/http";

/**
 * 1. GET: Get all enrolled classes for the current student
 */
export const getMyClasses = async (): Promise<ClassSummary[]> => {
  try {
    const response = await httpClient.get<{ success: boolean; data: { classes: any[] } }>(
      '/classes/my-enrolled',
      { requiresAuth: true }
    );

    if (!response.success || !response.data?.classes) {
      return [];
    }

    return response.data.classes.map((cls: any) => ({
      id: cls._id,
      name: cls.className,
      code: cls.classCode,
      students: cls.studentCount || 0,
      teacher: cls.teacher?.name || "Unknown",
      status: cls.status || 'active',
      requestDate: cls.joinedDate,
      requestId: cls._id
    }));

  } catch (error) {
    console.error("Failed to fetch my classes:", error);
    return [];
  }
};

/**
 * 2. POST: Gửi yêu cầu tham gia lớp học
 * Logic: Tìm Class theo Code -> Tạo dòng mới trong ClassJoinRequest
 */
// src/features/dashboard/data/student/myClassesApi.ts

// Định nghĩa kiểu kết quả trả về
type JoinClassResult = 
  | { success: true; data: ClassSummary }
  | { success: false; error: 'NOT_FOUND' | 'SERVER_ERROR' | 'EXISTED' };

/**
 * 2. POST: Join class by code
 */
export const joinClass = async (code: string): Promise<JoinClassResult> => {
  try {
    const response = await httpClient.post<{ success: boolean; data: any }>(
      '/classes/join',
      { classCode: code },
      { requiresAuth: true }
    );

    if (!response.success || !response.data) {
      return { success: false, error: 'SERVER_ERROR' };
    }
    const data = response.data;
    
    return {
      success: true,
      data: {
        id: data.classId,
        name: data.className,
        code: code,
        students: 0,
        status: data.status,
        teacher: "Unknown",
        requestDate: new Date().toISOString(),
        requestId: data.classId
      }
    };

  } catch (error: any) {
    if (error.status === 404) {
      return { success: false, error: 'NOT_FOUND' };
    }
    console.error("Join Class Error:", error);
    return { success: false, error: 'SERVER_ERROR' };
  }
};

/**
 * 3. DELETE: Cancel class join request (Not implemented in backend yet)
 */
export const cancelClassRequest = async (requestId: string): Promise<boolean> => {
  try {
    // TODO: Implement when backend endpoint is ready
    console.warn('cancelClassRequest not yet implemented');
    return false;
  } catch (error) {
    console.error("Failed to cancel class request:", error);
    return false;
  }
};