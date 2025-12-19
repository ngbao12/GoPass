const BaseRepository = require('./BaseRepository');
const ClassJoinRequest = require('../models/ClassJoinRequest');

class ClassJoinRequestRepository extends BaseRepository {
  constructor() {
    super(ClassJoinRequest);
  }

  async findPendingRequests(classId) {
    return await this.find({ classId, status: 'pending' }, { sort: { createdAt: -1 } });
  }

  async findByStudent(studentUserId, options = {}) {
    return await this.find({ studentUserId }, options);
  }

  async findRequest(classId, studentUserId) {
    return await this.findOne({ classId, studentUserId });
  }
}

module.exports = new ClassJoinRequestRepository();
