// Export all from service files
export * from './classApi';
export * from './examApi';
export * from './statsApi';

// Re-export types for easier importing
export type {
    ApiResponse,
    TeacherClass,
    ClassDetail,
    ClassMember,
    ClassJoinRequest,
    ExamAssignment,
    ClassStats,
    CreateClassData,
    ClassModel,
    ClassDetailResponse,
} from './types';

export type {
    TeacherExam,
    ExamDetail,
    ExamSubmissionSummary,
    ExamStatistics,
    CreateExamData,
    AssignExamData
} from './examApi';

// Export stats types
export type {
    TeacherStats,
    TeacherActivity,
    QuickClassInfo
} from './statsApi';