const BaseRepository = require('./BaseRepository');
const ClassMember = require('../models/ClassMember');

class ClassMemberRepository extends BaseRepository {
  constructor() {
    super(ClassMember);
  }

  async findByClass(classId, options = {}) {
    return await this.find({ classId, status: 'active' }, options);
  }

  async findByStudent(studentId, options = {}) {
    return await this.find({ studentId, status: 'active' }, options);
  }

  async findMember(classId, studentId) {
    return await this.findOne({ classId, studentId });
  }

  async isMember(classId, studentId) {
    return await this.exists({ classId, studentId, status: 'active' });
  }

  async removeMember(classId, studentId) {
    return await this.updateOne(
      { classId, studentId },
      { status: 'removed' }
    );
  }

  async countClassMembers(classId) {
    return await this.count({ classId, status: 'active' });
  }
}

module.exports = new ClassMemberRepository();
