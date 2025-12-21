const BaseRepository = require('./BaseRepository');
const ExamSubmission = require('../models/ExamSubmission');

class ExamSubmissionRepository extends BaseRepository {
  constructor() {
    super(ExamSubmission);
  }

  async findByAssignment(assignmentId, options = {}) {
    return await this.find({ assignmentId }, options);
  }

  async findByStudent(studentUserId, options = {}) {
    return await this.find({ studentUserId }, options);
  }

  async findByExam(examId, options = {}) {
    return await this.find({ examId }, options);
  }

  async findStudentSubmission(assignmentId, studentUserId) {
    return await this.findOne({ assignmentId, studentUserId });
  }

  async findInProgressSubmission(assignmentId, studentUserId) {
    return await this.findOne({ 
      assignmentId, 
      studentUserId,
      status: 'in_progress' 
    });
  }

  async submitSubmission(submissionId) {
    return await this.update(submissionId, {
      status: 'submitted',
      submittedAt: new Date(),
    });
  }

  async gradeSubmission(submissionId, totalScore) {
    return await this.update(submissionId, {
      status: 'graded',
      totalScore,
    });
  }

  async getStudentAttempts(assignmentId, studentUserId) {
    return await this.count({ assignmentId, studentUserId });
  }

  async calculateClassAverage(assignmentId) {
    const submissions = await this.find({ 
      assignmentId, 
      status: 'graded' 
    });
    
    if (submissions.length === 0) return 0;
    
    const total = submissions.reduce((sum, s) => sum + s.totalScore, 0);
    return total / submissions.length;
  }

  async findByExamAndStudent(examId, studentUserId, options = {}) {
    return await this.find({ examId, studentUserId }, options);
  }
}

module.exports = new ExamSubmissionRepository();
