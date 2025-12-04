const BaseRepository = require('./BaseRepository');
const ContestExam = require('../models/ContestExam');

class ContestExamRepository extends BaseRepository {
  constructor() {
    super(ContestExam);
  }

  async findByContest(contestId, options = {}) {
    return await this.find({ contestId }, { ...options, sort: { order: 1 } });
  }

  async findByExam(examId) {
    return await this.find({ examId });
  }

  async deleteByContest(contestId) {
    return await this.model.deleteMany({ contestId });
  }

  async getNextOrder(contestId) {
    const lastExam = await this.model
      .findOne({ contestId })
      .sort({ order: -1 });
    
    return lastExam ? lastExam.order + 1 : 1;
  }

  async countContestExams(contestId) {
    return await this.count({ contestId });
  }
}

module.exports = new ContestExamRepository();
