const ClassRepository = require('../repositories/ClassRepository');
const ClassMemberRepository = require('../repositories/ClassMemberRepository');
const ClassJoinRequestRepository = require('../repositories/ClassJoinRequestRepository');
const ExamRepository = require('../repositories/ExamRepository');
const ExamSubmissionRepository = require('../repositories/ExamSubmissionRepository');

class TeacherService {
  /**
   * Get teacher dashboard statistics
   * @param {String} teacherId - Teacher's user ID
   * @returns {Object} - { totalClasses, totalStudents, totalExams, pendingRequests }
   */
  async getTeacherStats(teacherId) {
    try {
      // Get all classes taught by this teacher
      const classes = await ClassRepository.find({ 
        teacherUserId: teacherId,
        isActive: true 
      });

      const classIds = classes.map(c => c._id);

      // Count total classes
      const totalClasses = classes.length;

      // Count unique students across all classes
      const uniqueStudents = await ClassMemberRepository.countUniqueStudentsByTeacher(teacherId);
      const totalStudents = uniqueStudents || 0;

      // Count exams created by this teacher
      const totalExams = await ExamRepository.count({ 
        createdBy: teacherId,
        isPublished: true 
      });

      // Count pending join requests across all teacher's classes
      let pendingRequests = 0;
      if (classIds.length > 0) {
        pendingRequests = await ClassJoinRequestRepository.count({
          classId: { $in: classIds },
          status: 'pending'
        });
      }

      return {
        totalClasses,
        totalStudents,
        totalExams,
        pendingRequests
      };
    } catch (error) {
      console.error('Error in getTeacherStats:', error);
      throw new Error('Failed to fetch teacher statistics');
    }
  }

  /**
   * Get teacher's classes overview with counts
   * @param {String} teacherId - Teacher's user ID
   * @returns {Array} - List of classes with student and pending request counts
   */
  async getClassesOverview(teacherId) {
    try {
      // Get all classes taught by this teacher
      const classes = await ClassRepository.find({ 
        teacherUserId: teacherId,
        isActive: true 
      }, {
        sort: { createdAt: -1 }
      });

      // Get counts for each class
      const classesWithCounts = await Promise.all(
        classes.map(async (classItem) => {
          // Count students in this class
          const studentCount = await ClassMemberRepository.countClassMembers(classItem._id);

          // Count pending join requests for this class
          const pendingRequests = await ClassJoinRequestRepository.count({
            classId: classItem._id,
            status: 'pending'
          });

          // Extract subject from className or description (you may need to adjust this)
          // For now, we'll use a simple heuristic or default value
          const subject = this.extractSubject(classItem.className, classItem.description);

          return {
            id: classItem._id.toString(),
            name: classItem.className,
            code: classItem.classCode,
            subject: subject,
            studentCount,
            pendingRequests
          };
        })
      );

      return classesWithCounts;
    } catch (error) {
      console.error('Error in getClassesOverview:', error);
      throw new Error('Failed to fetch classes overview');
    }
  }

  /**
   * Extract subject from class name or description
   * This is a helper method that can be customized based on your data structure
   */
  extractSubject(className, description) {
    // Common subjects to look for
    const subjects = [
      'Toán', 'Văn', 'Anh', 'Lý', 'Hóa', 'Sinh', 'Sử', 'Địa', 'GDCD',
      'Math', 'Literature', 'English', 'Physics', 'Chemistry', 'Biology',
      'History', 'Geography', 'Civic Education'
    ];

    // Check className first
    for (const subject of subjects) {
      if (className?.toLowerCase().includes(subject.toLowerCase())) {
        return subject;
      }
    }

    // Check description
    for (const subject of subjects) {
      if (description?.toLowerCase().includes(subject.toLowerCase())) {
        return subject;
      }
    }

    // Default subject
    return 'Tổng hợp';
  }

  /**
   * Get recent teacher activities
   * @param {String} teacherId - Teacher's user ID
   * @returns {Array} - List of recent activities
   */
  async getRecentActivities(teacherId) {
    try {
      const activities = [];

      // Get teacher's classes
      const classes = await ClassRepository.find({ 
        teacherUserId: teacherId,
        isActive: true 
      }, {
        limit: 5,
        sort: { createdAt: -1 }
      });

      const classIds = classes.map(c => c._id);

      if (classIds.length === 0) {
        return activities;
      }

      // Get recent submissions (last 10)
      const recentSubmissions = await ExamSubmissionRepository.find({
        classId: { $in: classIds },
        status: { $in: ['graded', 'pending_grading'] }
      }, {
        populate: ['studentUserId', 'examId', 'classId'],
        sort: { submittedAt: -1 },
        limit: 10
      });

      // Get recent join requests (last 5)
      const recentJoinRequests = await ClassJoinRequestRepository.find({
        classId: { $in: classIds },
        status: 'pending'
      }, {
        populate: ['studentUserId', 'classId'],
        sort: { requestedAt: -1 },
        limit: 5
      });

      // Format submissions as activities
      recentSubmissions.forEach(submission => {
        activities.push({
          id: submission._id.toString(),
          type: submission.status === 'graded' ? 'grade_updated' : 'submission',
          message: `${submission.studentUserId?.name || 'Học sinh'} đã ${submission.status === 'graded' ? 'hoàn thành' : 'nộp'} bài thi`,
          timestamp: submission.submittedAt?.toISOString() || new Date().toISOString(),
          className: submission.classId?.className || '',
          studentName: submission.studentUserId?.name || ''
        });
      });

      // Format join requests as activities
      recentJoinRequests.forEach(request => {
        activities.push({
          id: request._id.toString(),
          type: 'join_request',
          message: `${request.studentUserId?.name || 'Học sinh'} yêu cầu tham gia lớp`,
          timestamp: request.requestedAt?.toISOString() || new Date().toISOString(),
          className: request.classId?.className || '',
          studentName: request.studentUserId?.name || ''
        });
      });

      // Sort all activities by timestamp and limit to 10 most recent
      activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      return activities.slice(0, 10);
    } catch (error) {
      console.error('Error in getRecentActivities:', error);
      throw new Error('Failed to fetch recent activities');
    }
  }
}

module.exports = new TeacherService();
