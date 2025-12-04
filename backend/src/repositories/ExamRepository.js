const BaseRepository = require('./BaseRepository');
const Exam = require('../models/Exam');

class ExamRepository extends BaseRepository {
  constructor() {
    super(Exam);
  }

  async findByCreator(createdBy, options = {}) {
    return await this.find({ createdBy }, options);
  }

  async findBySubject(subject, options = {}) {
    return await this.find({ subject }, options);
  }

  async findPublishedExams(filter = {}) {
    return await this.find({ ...filter, isPublished: true });
  }

  async publishExam(examId) {
    return await this.update(examId, { isPublished: true });
  }

  async unpublishExam(examId) {
    return await this.update(examId, { isPublished: false });
  }
}

module.exports = new ExamRepository();
