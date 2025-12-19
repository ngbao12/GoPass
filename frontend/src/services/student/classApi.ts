// src/services/student/classApi.ts
import { ClassDetail, ClassAssignment, AssignmentStatus } from "@/features/dashboard/types/student/";
import { httpClient } from "@/lib/http";

const formatDate = (isoString: string) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleDateString('vi-VN', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export const getClassDetailById = async (
  classId: string
): Promise<ClassDetail | null> => {
  try {
    const response = await httpClient.get<{ success: boolean; data: any }>(
      `/classes/${classId}`,
      { requiresAuth: true }
    );

    if (!response.success || !response.data) return null;
    
    const classData = response.data;

    // Extract data from backend response
    const teacherName = classData.teacher?.name || "Giáo viên";
    const studentCount = classData.studentCount || 0;
    
    // For now, return a simplified version
    // TODO: Fetch assignments and submissions separately if needed

    return {
      id: classData._id,
      code: classData.classCode,
      name: classData.className,
      subject: "Tổng hợp", // TODO: Derive from assignments
      teacher: teacherName,
      studentsCount: studentCount,
      description: classData.description || "",
      
      stats: {
        rank: 0,
        totalStudents: studentCount,
        assignmentsDone: 0, // TODO: Fetch from assignments
        totalAssignments: 0, // TODO: Fetch from assignments
        avgScore: 0 // TODO: Calculate from submissions
      },
      
      assignments: [] // TODO: Fetch assignments separately
    };

  } catch (error) {
    console.error("Failed to fetch class details:", error);
    return null;
  }
};