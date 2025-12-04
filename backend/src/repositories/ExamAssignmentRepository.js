const BaseRepository = require('./BaseRepository');
const ExamAssignment = require('../models/ExamAssignment');

class ExamAssignmentRepository extends BaseRepository {
  constructor() {
    super(ExamAssignment);
  }

  async findByExam(examId, options = {}) {
    return await this.find({ examId }, options);
  }

  async findByClass(classId, options = {}) {
    return await this.find({ classId }, options);
  }

  async findActiveAssignments(classId) {
    const now = new Date();
    return await this.find({
      classId,
      startTime: { $lte: now },
      endTime: { $gte: now },
    });
  }

  async findUpcomingAssignments(classId) {
    const now = new Date();
    return await this.find({
      classId,
      startTime: { $gt: now },
    }, { sort: { startTime: 1 } });
  }

  async isAssignmentActive(assignmentId) {
    const assignment = await this.findById(assignmentId);
    if (!assignment) return false;

    const now = new Date();
    return now >= assignment.startTime && now <= assignment.endTime;
  }
}

module.exports = new ExamAssignmentRepository();
