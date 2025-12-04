const BaseRepository = require('./BaseRepository');
const ManualGrading = require('../models/ManualGrading');

class ManualGradingRepository extends BaseRepository {
  constructor() {
    super(ManualGrading);
  }

  async findByAnswer(answerId) {
    return await this.findOne({ answerId });
  }

  async findByGrader(graderId, options = {}) {
    return await this.find({ graderId }, options);
  }

  async createOrUpdate(answerId, graderId, score, comment = '') {
    const existing = await this.findOne({ answerId });
    
    if (existing) {
      return await this.update(existing._id, {
        score,
        comment,
        graderId,
        gradedAt: new Date(),
      });
    }

    return await this.create({
      answerId,
      graderId,
      score,
      comment,
    });
  }
}

module.exports = new ManualGradingRepository();
