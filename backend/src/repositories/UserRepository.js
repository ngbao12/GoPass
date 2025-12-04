const BaseRepository = require('./BaseRepository');
const User = require('../models/User');

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return await this.model.findOne({ email: email.toLowerCase() });
  }

  async findByRole(role, options = {}) {
    return await this.find({ role }, options);
  }

  async findActiveUsers(filter = {}) {
    return await this.find({ ...filter, status: 'active' });
  }

  async updateStatus(userId, status) {
    return await this.update(userId, { status });
  }

  async searchUsers(keyword, filter = {}) {
    const searchFilter = {
      ...filter,
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } },
      ],
    };
    return await this.find(searchFilter);
  }
}

module.exports = new UserRepository();
