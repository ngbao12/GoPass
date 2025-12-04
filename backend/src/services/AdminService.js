const UserRepository = require('../repositories/UserRepository');
const MailProvider = require('../providers/MailProvider');
const PasswordHasher = require('../providers/PasswordHasher');

class AdminService {
  // List users with filter
  async listUsers(filter) {
    const { role, status, keyword, page = 1, limit = 20 } = filter;

    const searchFilter = {};
    if (role) searchFilter.role = role;
    if (status) searchFilter.status = status;

    let users;
    if (keyword) {
      users = await UserRepository.searchUsers(keyword, searchFilter);
    } else {
      users = await UserRepository.find(searchFilter, {
        skip: (page - 1) * limit,
        limit,
        sort: { createdAt: -1 },
      });
    }

    const total = await UserRepository.count(searchFilter);

    // Sanitize users
    const sanitizedUsers = users.map(user => this.sanitizeUser(user));

    return {
      users: sanitizedUsers,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Get user detail
  async getUserDetail(userId) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return this.sanitizeUser(user);
  }

  // Update user status
  async updateUserStatus(userId, status) {
    if (!['active', 'locked'].includes(status)) {
      throw new Error('Invalid status');
    }

    const user = await UserRepository.updateStatus(userId, status);
    if (!user) {
      throw new Error('User not found');
    }

    return this.sanitizeUser(user);
  }

  // Reset user password
  async resetUserPassword(userId) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Generate temporary password
    const tempPassword = PasswordHasher.generateRandomPassword();

    // Hash and update password
    const passwordHash = await PasswordHasher.hash(tempPassword);
    await UserRepository.update(userId, { passwordHash });

    // Send email with temporary password
    await MailProvider.sendMail(
      user.email,
      'Password Reset - GoPass',
      `
        <h1>Password Reset</h1>
        <p>Hi ${user.name},</p>
        <p>Your password has been reset by an administrator.</p>
        <p>Your temporary password is: <strong>${tempPassword}</strong></p>
        <p>Please change your password after logging in.</p>
        <p>Best regards,<br>GoPass Team</p>
      `
    );

    return { message: 'Password reset successfully. Email sent to user.' };
  }

  // Get system metrics
  async getSystemMetrics() {
    const totalUsers = await UserRepository.count();
    const activeUsers = await UserRepository.count({ status: 'active' });
    const students = await UserRepository.count({ role: 'student' });
    const teachers = await UserRepository.count({ role: 'teacher' });

    // You can add more metrics here like total classes, exams, etc.

    return {
      totalUsers,
      activeUsers,
      students,
      teachers,
    };
  }

  // Remove sensitive data
  sanitizeUser(user) {
    const userObj = user.toObject ? user.toObject() : user;
    delete userObj.passwordHash;
    return userObj;
  }
}

module.exports = new AdminService();
