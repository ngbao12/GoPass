import { ClassSummary } from "@/features/dashboard/types/student/";
import { httpClient } from "@/lib/http";

/**
 * Helper: Maps backend data objects to the standardized ClassSummary frontend interface.
 * Based on the backend refactor, the data is already partially enriched (populated).
 */
const mapToClassSummary = (item: any, status: 'active' | 'pending'): ClassSummary => {
  return {
    // Backend uses _id from MongoDB
    id: item._id, 
    name: item.className || "Unnamed Class",
    code: item.classCode || "N/A",
    students: item.studentCount || 0,
    teacher: item.teacher?.name || "Instructor",
    status: status,
    requestDate: item.joinedDate || item.requestDate 
      ? new Date(item.joinedDate || item.requestDate).toLocaleDateString('vi-VN') 
      : "N/A",
    requestId: item.requestId
  };
};

/**
 * 1. GET: Fetch all classes where the student is an active member.
 * Endpoint: /api/classes/enrolled (Aligns with Spec 2.11)
 */
export const getEnrolledClasses = async (): Promise<ClassSummary[]> => {
  try {
    const response = await httpClient.get<{ 
      success: boolean; 
      data: any[] 
    }>('/classes/enrolled', { requiresAuth: true });

    if (!response.success || !Array.isArray(response.data)) {
      return [];
    }

    return response.data.map((item) => mapToClassSummary(item, 'active'));
  } catch (error) {
    console.error("Failed to fetch enrolled classes:", error);
    return [];
  }
};

/**
 * 2. GET: Fetch all join requests awaiting teacher approval.
 * Endpoint: /api/classes/join-requests (Aligns with Spec 2.8)
 */
export const getPendingRequests = async (): Promise<ClassSummary[]> => {
  try {
    const response = await httpClient.get<{ 
      success: boolean; 
      data: any[] 
    }>('/classes/pending-requests', { requiresAuth: true });

    if (!response.success || !Array.isArray(response.data)) {
      return [];
    }

    return response.data.map((item) => mapToClassSummary(item, 'pending'));
  } catch (error) {
    console.error("Failed to fetch pending requests:", error);
    return [];
  }
};

/**
 * 3. GET: Combined fetch for both active and pending classes.
 * Runs both requests in parallel to optimize dashboard loading.
 */
export const getMyClasses = async (): Promise<ClassSummary[]> => {
  const [enrolled, pending] = await Promise.all([
    getEnrolledClasses(),
    getPendingRequests()
  ]);
  return [...enrolled, ...pending];
};

/**
 * Result type for the joinClass operation.
 */
export type JoinClassResult = 
  | { success: true; data: ClassSummary }
  | { success: false; error: 'NOT_FOUND' | 'SERVER_ERROR' | 'EXISTED' };

/**
 * 4. POST: Send a request to join a class using a class code.
 * Endpoint: /api/classes/join (Aligns with Spec 2.7)
 */
export const joinClass = async (code: string): Promise<JoinClassResult> => {
  try {
    const response = await httpClient.post<{ 
      success: boolean; 
      data: any;
      message?: string;
    }>(
      '/classes/join',
      { classCode: code.trim().toUpperCase() },
      { requiresAuth: true }
    );

    if (!response.success || !response.data) {
      return { success: false, error: 'SERVER_ERROR' };
    }

    const { data } = response;
    
    return {
      success: true,
      data: {
        id: data.classId,
        name: data.className,
        code: code.toUpperCase(),
        students: 0,
        // New requests are 'pending' unless the class does not require approval
        status: data.status === 'approved' ? 'active' : 'pending',
        teacher: data.teacherName || "Instructor",
        requestDate: new Date().toLocaleDateString('vi-VN'),
        requestId: data._id || data.classId
      }
    };

  } catch (error: any) {
    const status = error.status || error.response?.status;
    
    // Handle specific error codes from backend
    if (status === 404) return { success: false, error: 'NOT_FOUND' };
    if (status === 409) return { success: false, error: 'EXISTED' }; 
    
    console.error("Join Class Error:", error);
    return { success: false, error: 'SERVER_ERROR' };
  }
};

/**
 * 5. DELETE: Cancel a pending join request.
 * Endpoint: /api/classes/join-requests/:requestId
 */
export const cancelClassRequest = async (requestId: string): Promise<boolean> => {
  console.log("Cancelling class request with ID:", requestId);
  try {
    const response = await httpClient.delete<{ success: boolean }>(
      `/classes/cancel-request/${requestId}`,
      { requiresAuth: true }
    );
    return response.success;
  } catch (error) {
    console.error("Failed to cancel class request:", error);
    return false;
  }
};