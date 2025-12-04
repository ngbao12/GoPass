const BaseRepository = require('./BaseRepository');
const Class = require('../models/Class');

class ClassRepository extends BaseRepository {
  constructor() {
    super(Class);
  }

  async findByCode(code) {
    return await this.model.findOne({ code: code.toUpperCase() });
  }

  async findByTeacher(teacherId, options = {}) {
    return await this.find({ teacherId }, options);
  }

  async generateUniqueCode() {
    let code;
    let exists = true;

    while (exists) {
      // Generate 6-character random code
      code = Math.random().toString(36).substring(2, 8).toUpperCase();
      exists = await this.model.exists({ code });
    }

    return code;
  }

  async findActiveClasses(filter = {}) {
    return await this.find({ ...filter, isActive: true });
  }
}

module.exports = new ClassRepository();
