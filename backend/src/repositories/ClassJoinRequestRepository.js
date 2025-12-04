const BaseRepository = require('./BaseRepository');
const ClassJoinRequest = require('../models/ClassJoinRequest');

class ClassJoinRequestRepository extends BaseRepository {
  constructor() {
    super(ClassJoinRequest);
  }

  async findPendingRequests(classId) {
    return await this.find({ classId, status: 'pending' }, { sort: { requestedAt: -1 } });
  }

  async findByStudent(studentId, options = {}) {
    return await this.find({ studentId }, options);
  }

  async findRequest(classId, studentId) {
    return await this.findOne({ classId, studentId, status: 'pending' });
  }

  async approveRequest(requestId, processedBy) {
    return await this.update(requestId, {
      status: 'accepted',
      processedAt: new Date(),
      processedBy,
    });
  }

  async rejectRequest(requestId, processedBy) {
    return await this.update(requestId, {
      status: 'rejected',
      processedAt: new Date(),
      processedBy,
    });
  }
}

module.exports = new ClassJoinRequestRepository();
