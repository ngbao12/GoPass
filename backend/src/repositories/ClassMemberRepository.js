const BaseRepository = require('./BaseRepository');
const ClassMember = require('../models/ClassMember');

class ClassMemberRepository extends BaseRepository {
  constructor() {
    super(ClassMember);
  }

  async findByClass(classId, options = {}) {
    return await this.find({ classId, status: 'active' }, options);
  }

  async findByStudent(studentUserId, options = {}) {
    return await this.find({ studentUserId, status: 'active' }, options);
  }

  async findMember(classId, studentUserId) {
    return await this.findOne({ classId, studentUserId });
  }

  async isMember(classId, studentUserId) {
    return await this.exists({ classId, studentUserId, status: 'active' });
  }

  async removeMember(classId, studentUserId) {
    return await this.updateOne(
      { classId, studentUserId },
      { status: 'removed' }
    );
  }

  async countClassMembers(classId) {
    return await this.count({ classId, status: 'active' });
  }
}

module.exports = new ClassMemberRepository();
