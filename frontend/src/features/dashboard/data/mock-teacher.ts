import { TeacherDashboardData } from "../types/teacher";

export const mockTeacherData: TeacherDashboardData = {
    stats: {
        totalClasses: 3,
        totalStudents: 195,
        totalExams: 10,
        totalContests: 8
    },

    classes: [
        {
            id: "class-1",
            name: "Lớp 12A1 - Trường THPT Nguyễn Huệ",
            subject: "Toán",
            grade: "12",
            studentCount: 45,
            examCount: 5,
            description: "Lớp chuyên Toán - Ôn thi THPT Quốc gia 2025",
            createdAt: "2025-09-01T00:00:00Z"
        },
        {
            id: "class-2",
            name: "Khóa Luyện Thi Đại Học 2025",
            subject: "Toán",
            grade: "12",
            studentCount: 120,
            examCount: 8,
            description: "Khóa luyện thi đại học các môn thi THPT QG",
            createdAt: "2025-09-01T00:00:00Z"
        },
        {
            id: "class-3",
            name: "Lớp Bồi Dưỡng HSG Toán",
            subject: "Toán",
            grade: "11",
            studentCount: 30,
            examCount: 6,
            description: "Lớp bồi dưỡng học sinh giỏi Toán cấp tỉnh",
            createdAt: "2025-09-15T00:00:00Z"
        }
    ],

    exams: [
        {
            id: "1",
            title: "Đề thi thử THPT QG lần 1 - Toán",
            subject: "Toán",
            classId: "class-1",
            className: "Lớp 12A1 - Trường THPT Nguyễn Huệ",
            totalQuestions: 50,
            duration: 90,
            status: "active",
            totalStudents: 45,
            totalSubmissions: 38,
            averageScore: 7.8,
            createdAt: "2025-12-01T00:00:00Z",
            startTime: "2025-12-11T07:00:00Z",
            endTime: "2025-12-15T23:59:00Z",
            description: "Đề thi thử THPT Quốc gia môn Toán lần 1"
        },
        {
            id: "2",
            title: "Kiểm tra Văn - Nghị luận xã hội",
            subject: "Văn",
            classId: "class-2",
            className: "Khóa Luyện Thi Đại Học 2025",
            totalQuestions: 1,
            duration: 120,
            status: "completed",
            totalStudents: 120,
            totalSubmissions: 115,
            averageScore: 6.8,
            createdAt: "2025-11-20T00:00:00Z",
            startTime: "2025-11-25T08:00:00Z",
            endTime: "2025-11-25T23:59:00Z",
            description: "Bài kiểm tra viết văn nghị luận xã hội"
        },
        {
            id: "3",
            title: "Đề thi thử Tiếng Anh THPT QG",
            subject: "Tiếng Anh",
            classId: "class-1",
            className: "Lớp 12A1 - Trường THPT Nguyễn Huệ",
            totalQuestions: 50,
            duration: 60,
            status: "upcoming",
            totalStudents: 45,
            totalSubmissions: 0,
            averageScore: 0,
            createdAt: "2025-12-10T00:00:00Z",
            startTime: "2025-12-20T09:00:00Z",
            endTime: "2025-12-20T23:59:00Z",
            description: "Đề thi thử THPT Quốc gia môn Tiếng Anh"
        }
    ],

    recentActivity: [
        {
            id: "1",
            type: "exam_completion",
            message: "Nguyễn Văn A đã hoàn thành Đề thi thử THPT QG - Toán",
            timestamp: "2025-12-11T08:30:00Z",
            studentName: "Nguyễn Văn A",
            examTitle: "Đề thi thử THPT QG - Toán"
        },
        {
            id: "2",
            type: "student_joined",
            message: "Trần Thị B đã tham gia lớp Lớp 12A1",
            timestamp: "2025-12-11T07:15:00Z",
            studentName: "Trần Thị B"
        },
        {
            id: "3",
            type: "exam_created",
            message: "Bạn đã tạo đề thi Kiểm tra Văn - Tá cảnh",
            timestamp: "2025-12-11T06:00:00Z",
            examTitle: "Kiểm tra Văn - Tá cảnh"
        },
        {
            id: "4",
            type: "reminder",
            message: "Hệ thống nhắc nhở: 12 học sinh chưa làm bài Toán",
            timestamp: "2025-12-11T05:30:00Z"
        }
    ],

    topStudents: [
        {
            id: "student-1",
            name: "Nguyễn Văn A",
            className: "Lớp 12A1",
            averageScore: 8.5,
            totalExams: 12,
            trend: "up"
        },
        {
            id: "student-2",
            name: "Trần Thị B",
            className: "Lớp 12A1",
            averageScore: 9.2,
            totalExams: 15,
            trend: "up"
        },
        {
            id: "student-3",
            name: "Lê Văn C",
            className: "Lớp 12A1",
            averageScore: 7.3,
            totalExams: 8,
            trend: "down"
        }
    ],

    recentExams: [
        {
            id: "exam-1",
            title: "Đề thi thử THPT QG lần 1 - Toán",
            classId: "class-1",
            className: "Lớp 12A1",
            totalSubmissions: 38,
            totalStudents: 45,
            completionRate: 84.4,
            createdAt: "2025-12-10T00:00:00Z",
            duration: 90
        },
        {
            id: "exam-2",
            title: "Kiểm tra Văn - Nghị luận xã hội",
            classId: "class-1",
            className: "Lớp 12A1",
            totalSubmissions: 45,
            totalStudents: 45,
            completionRate: 100,
            createdAt: "2025-12-09T00:00:00Z",
            duration: 120
        },
        {
            id: "exam-3",
            title: "Đề thi thử Tiếng Anh THPT QG",
            classId: "class-2",
            className: "Lớp 12A2",
            totalSubmissions: 35,
            totalStudents: 42,
            completionRate: 83.3,
            createdAt: "2025-12-08T00:00:00Z",
            duration: 60
        }
    ]
};