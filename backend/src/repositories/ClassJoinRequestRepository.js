// src/repositories/ClassJoinRequestRepository.js
const BaseRepository = require('./BaseRepository');
const ClassJoinRequest = require('../models/ClassJoinRequest');

class ClassJoinRequestRepository extends BaseRepository {
  constructor() {
    super(ClassJoinRequest);
  }

  async findPendingRequests(classId, options = {}) {
    return await this.find({ classId, status: 'pending' }, options);
  }

  async findByStudent(studentUserId, filter = {}, options = {}) {
    // Merges the required student ID with optional filters (like status)
    const finalFilter = { studentUserId, ...filter };
    return await this.find(finalFilter, options);
  }

  async findRequest(classId, studentUserId) {
    return await this.findOne({ classId, studentUserId });
  }

  async deleteRequest(requestId, studentUserId) {
    return await this.model.findOneAndDelete({ 
      _id: requestId, 
      studentUserId: studentUserId,
      status: 'pending'
    });
  }
}

module.exports = new ClassJoinRequestRepository();