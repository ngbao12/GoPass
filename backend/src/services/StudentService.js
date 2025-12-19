const ClassMemberRepository = require('../repositories/ClassMemberRepository');
const ExamSubmissionRepository = require('../repositories/ExamSubmissionRepository');

class StudentService {
  /**
   * Get student dashboard statistics
   */
  async getStudentStats(studentId) {
    // Parallel fetch: classes and submissions
    const [classMemberships, submissions] = await Promise.all([
      ClassMemberRepository.findByStudent(studentId, { status: 'active' }),
      ExamSubmissionRepository.find({ 
        studentUserId: studentId
      })
    ]);

    const joinedClasses = classMemberships.length;
    
    // Only count submitted exams (not in_progress)
    const submittedExams = submissions.filter(sub => sub.status !== 'in_progress');
    const examsTaken = submittedExams.length;

    // Calculate average score from exams with scores
    let totalScore = 0;
    let scoredCount = 0;
    submittedExams.forEach(sub => {
      const score = Number(sub.totalScore || sub.finalScore || 0);
      if (!isNaN(score) && score > 0) {
        totalScore += score;
        scoredCount++;
      }
    });
    const averageScore = scoredCount > 0 ? Number((totalScore / scoredCount).toFixed(1)) : 0;

    // Calculate days until exam (static date for now)
    const examDate = new Date('2026-06-25T00:00:00');
    const today = new Date();
    const diffTime = examDate.getTime() - today.getTime();
    const daysUntilExam = diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;

    return {
      joinedClasses,
      examsTaken,
      averageScore,
      daysUntilExam
    };
  }

  /**
   * Get student exam history with statistics
   */
  async getStudentHistory(studentId) {
    const submissions = await ExamSubmissionRepository.find(
      { 
        studentUserId: studentId,
        status: { $in: ['graded', 'completed'] }
      },
      {
        populate: ['examId', 'classId', 'contestId'],
        sort: { submittedAt: -1, createdAt: -1 }
      }
    );

    // Map to history items
    const list = submissions.map(sub => {
      let type = 'practice_global';
      if (sub.classId) type = 'practice_class';
      else if (sub.contestId) type = 'contest';

      const exam = sub.examId || {};
      const dateObj = new Date(sub.submittedAt || sub.createdAt);

      return {
        id: sub._id.toString(),
        title: exam.title || 'Bài thi',
        subject: exam.subject || 'Tổng hợp',
        duration: exam.durationMinutes || 0,
        score: sub.totalScore || sub.finalScore || 0,
        maxScore: sub.maxScore || exam.totalPoints || 10,
        completedDate: dateObj.toLocaleDateString('vi-VN'),
        type,
        className: sub.classId?.className,
        rank: undefined
      };
    });

    // Calculate statistics
    const totalExams = list.length;
    let sumScore = 0;
    let highestScore = 0;
    let totalTime = 0;
    let contestCount = 0;
    let practiceCount = 0;
    const subjectMap = {};

    list.forEach(item => {
      sumScore += item.score;
      totalTime += item.duration;
      if (item.score > highestScore) highestScore = item.score;

      if (item.type === 'contest') contestCount++;
      else practiceCount++;

      const subj = item.subject || 'Khác';
      if (!subjectMap[subj]) subjectMap[subj] = { total: 0, count: 0 };
      subjectMap[subj].total += item.score;
      subjectMap[subj].count += 1;
    });

    const avgScore = totalExams > 0 ? Number((sumScore / totalExams).toFixed(1)) : 0;

    let bestSubject = 'Chưa có';
    let maxAvgSubjectScore = -1;
    Object.entries(subjectMap).forEach(([subj, data]) => {
      const avg = data.total / data.count;
      if (avg > maxAvgSubjectScore) {
        maxAvgSubjectScore = avg;
        bestSubject = subj;
      }
    });

    return {
      list,
      stats: {
        totalExams,
        avgScore,
        totalContests: contestCount,
        totalPractice: practiceCount,
        highestScore,
        bestSubject: totalExams > 0 ? bestSubject : '---',
        totalTime
      }
    };
  }

  /**
   * Get student activity for last 7 days
   */
  async getStudentActivity(studentId) {
    const submissions = await ExamSubmissionRepository.find(
      { studentUserId: studentId },
      { populate: 'examId' }
    );

    // Initialize 7-day structure
    const activity = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      activity.push({
        date: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        hours: 0,
        exams: 0,
        score: 0,
        _compareDate: d.toDateString()
      });
    }

    // Aggregate submissions by date
    submissions.forEach(sub => {
      if (!sub.submittedAt && !sub.startedAt) return;
      
      const subDate = new Date(sub.submittedAt || sub.startedAt).toDateString();
      const dayStat = activity.find(d => d._compareDate === subDate);
      
      if (dayStat) {
        dayStat.exams += 1;
        const duration = sub.examId?.durationMinutes || 0;
        dayStat.hours += duration / 60;
        const score = sub.totalScore || sub.finalScore || 0;
        if (score > dayStat.score) dayStat.score = score;
      }
    });

    // Clean up and round hours
    return activity.map(({ _compareDate, ...d }) => ({
      ...d,
      hours: Number(d.hours.toFixed(1))
    }));
  }
}

module.exports = new StudentService();
