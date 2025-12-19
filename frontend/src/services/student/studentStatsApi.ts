// src/services/studentStatsApi.ts
import { StudentStats, HistoryDataResponse, HistoryItem, HistoryStats, PerformanceDataPoint, HistoryType } from "@/features/dashboard/types/student/";
import { httpClient } from "@/lib/http";

/**
 * Fetch student statistics for dashboard
 * Uses the new MongoDB backend API
 */
export const fetchStudentStats = async (): Promise<StudentStats> => {
  try {
    const response = await httpClient.get<{ success: boolean; data: { classes: any[] } }>(
      '/classes/my-enrolled',
      { requiresAuth: true }
    );

    const joinedClassesCount = response.success && response.data?.classes ? response.data.classes.length : 0;
    
    // Calculate stats from the classes data
    let totalAssignments = 0;
    let completedAssignments = 0;
    let totalScore = 0;
    let scoredCount = 0;

    if (response.success && response.data?.classes) {
      response.data.classes.forEach((cls: any) => {
        if (cls.stats) {
          totalAssignments += cls.stats.totalAssignments || 0;
          completedAssignments += cls.stats.completedAssignments || 0;
          if (cls.stats.avgScore > 0) {
            totalScore += cls.stats.avgScore;
            scoredCount++;
          }
        }
      });
    }

    const averageScore = scoredCount > 0 ? Number((totalScore / scoredCount).toFixed(1)) : 0;

    // Calculate days until exam (static)
    const examDate = new Date("2026-06-25T00:00:00");
    const today = new Date();
    const diffTime = examDate.getTime() - today.getTime();
    const daysUntilExam = diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;

    return {
      joinedClasses: joinedClassesCount,
      examsTaken: completedAssignments,
      averageScore: averageScore,
      daysUntilExam: daysUntilExam,
    };

  } catch (error) {
    console.error("API Error fetching student stats:", error);
    return {
      joinedClasses: 0,
      examsTaken: 0,
      averageScore: 0,
      daysUntilExam: 0,
    };
  }
};

/**
 * Fetch student history (simplified for now - returns empty data)
 * TODO: Implement when history endpoints are available in backend
 */
export const fetchStudentHistory = async (): Promise<HistoryDataResponse> => {
  try {
    // TODO: Implement when backend endpoints are ready
    console.warn('fetchStudentHistory not fully implemented yet');
    
    return {
      list: [],
      stats: {
        totalExams: 0,
        avgScore: 0,
        totalContests: 0,
        totalPractice: 0,
        highestScore: 0,
        bestSubject: "---",
        totalTime: 0
      }
    };
  } catch (error) {
    console.error("Error fetching history:", error);
    return {
      list: [],
      stats: {
        totalExams: 0, avgScore: 0, totalContests: 0, totalPractice: 0,
        highestScore: 0, bestSubject: "---", totalTime: 0
      }
    };
  }
};

/**
 * Fetch student activity for the last 7 days (simplified)
 * TODO: Implement when activity endpoints are available in backend
 */
export const fetchStudentActivity = async (): Promise<PerformanceDataPoint[]> => {
  try {
    // TODO: Implement when backend endpoints are ready
    console.warn('fetchStudentActivity not fully implemented yet');
    
    // Return empty 7-day structure
    const last7Days: PerformanceDataPoint[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
      
      last7Days.push({
        date: dateStr,
        hours: 0,
        exams: 0,
        score: 0
      });
    }

    return last7Days;
  } catch (error) {
    console.error("Error fetching activity:", error);
    return [];
  }
};