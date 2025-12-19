const BaseRepository = require('./BaseRepository');
const Class = require('../models/Class');

class ClassRepository extends BaseRepository {
  constructor() {
    super(Class);
  }

  async findByCode(classCode) {
    return await this.model.findOne({ classCode: classCode.toUpperCase() });
  }

  async findByTeacher(teacherUserId, options = {}) {
    return await this.find({ teacherUserId }, options);
  }

  async generateUniqueCode() {
    let classCode;
    let exists = true;

    while (exists) {
      // Generate 6-character random code
      classCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      exists = await this.model.exists({ classCode });
    }

    return classCode;
  }

  async findActiveClasses(filter = {}) {
    return await this.find({ ...filter, isActive: true });
  }
}

module.exports = new ClassRepository();
