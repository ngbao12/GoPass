// src/repositories/ClassMemberRepository.js
const BaseRepository = require('./BaseRepository');
const ClassMember = require('../models/ClassMember');

class ClassMemberRepository extends BaseRepository {
  constructor() {
    super(ClassMember);
  }
  
  async findByClass(classId, filter = {}, options = {}) {
    const finalFilter = { classId, ...filter };
    return await this.find(finalFilter, options);
  }

  async findByStudent(studentUserId, filter = {}, options = {}) {
    const finalFilter = { studentUserId, ...filter };
    return await this.find(finalFilter, options);
  }

  async findMember(classId, studentUserId) {
    return await this.findOne({ classId, studentUserId });
  }

  async isMember(classId, studentUserId) {
    // We keep 'active' here if the name of the function is explicitly "isMember"
    return await this.model.exists({ classId, studentUserId, status: 'active' });
  }

  async removeMember(classId, studentUserId) {
    return await this.model.updateOne(
      { classId, studentUserId },
      { status: 'removed' }
    );
  }

  async countClassMembers(classId, filter = { status: 'active' }) {
    return await this.model.countDocuments({ classId, ...filter });
  }
}

module.exports = new ClassMemberRepository();