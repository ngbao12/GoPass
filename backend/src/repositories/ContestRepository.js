const BaseRepository = require('./BaseRepository');
const Contest = require('../models/Contest');

class ContestRepository extends BaseRepository {
  constructor() {
    super(Contest);
  }

  async findByOwner(ownerId, options = {}) {
    return await this.find({ ownerId }, options);
  }

  async findPublicContests(filter = {}) {
    return await this.find({ ...filter, isPublic: true });
  }

  async findActiveContests() {
    const now = new Date();
    return await this.find({
      startTime: { $lte: now },
      endTime: { $gte: now },
      status: 'ongoing',
    });
  }

  async findUpcomingContests() {
    const now = new Date();
    return await this.find({
      startTime: { $gt: now },
      status: 'upcoming',
    }, { sort: { startTime: 1 } });
  }

  async updateContestStatus(contestId, status) {
    return await this.update(contestId, { status });
  }

  async updateExpiredContests() {
    const now = new Date();
    return await this.model.updateMany(
      { endTime: { $lt: now }, status: { $ne: 'ended' } },
      { status: 'ended' }
    );
  }
}

module.exports = new ContestRepository();
