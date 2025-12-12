export interface TeacherClass {
    id: string;
    name: string;
    subject: string;
    studentCount: number;
    examCount: number;
    createdAt: string;
    teacherName?: string;
}

export interface TeacherStats {
    totalClasses: number;
    totalStudents: number;
    totalExams: number;
    totalContests: number;
}

export interface RecentActivity {
    id: string;
    type: 'exam_completion' | 'student_joined' | 'exam_created' | 'reminder';
    message: string;
    timestamp: string;
    studentName?: string;
    examTitle?: string;
}

export interface TopStudent {
    id: string;
    name: string;
    className: string;
    averageScore: number;
    totalExams: number;
    trend: 'up' | 'down' | 'stable';
}

export interface TeacherExam {
    id: string;
    title: string;
    classId: string;
    className: string;
    totalSubmissions: number;
    totalStudents: number;
    completionRate: number;
    createdAt: string;
    duration: number;
}

export interface TeacherDashboardData {
    stats: TeacherStats;
    classes: TeacherClass[];
    recentActivity: RecentActivity[];
    topStudents: TopStudent[];
    recentExams: TeacherExam[];
}