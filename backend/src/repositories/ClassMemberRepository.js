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

  /**
   * Count unique students across all classes taught by a teacher
   * @param {String} teacherId - Teacher's user ID
   * @returns {Number} - Count of unique students
   */
  async countUniqueStudentsByTeacher(teacherId) {
    const Class = require('../models/Class');
    
    // First, get all class IDs for this teacher
    const classes = await Class.find({ teacherUserId: teacherId, isActive: true }).select('_id');
    const classIds = classes.map(c => c._id);

    if (classIds.length === 0) {
      return 0;
    }

    // Use aggregation to count unique students
    const result = await this.model.aggregate([
      {
        $match: {
          classId: { $in: classIds },
          status: 'active'
        }
      },
      {
        $group: {
          _id: '$studentUserId'
        }
      },
      {
        $count: 'total'
      }
    ]);

    return result.length > 0 ? result[0].total : 0;
  }
}

module.exports = new ClassMemberRepository();