const UserRepository = require("../repositories/UserRepository");
const MailProvider = require("../providers/MailProvider");
const PasswordHasher = require("../providers/PasswordHasher");

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
    const sanitizedUsers = users.map((user) => this.sanitizeUser(user));

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
      throw new Error("User not found");
    }

    return this.sanitizeUser(user);
  }

  // Update user status
  async updateUserStatus(userId, status) {
    if (!["active", "locked"].includes(status)) {
      throw new Error("Invalid status");
    }

    const user = await UserRepository.updateStatus(userId, status);
    if (!user) {
      throw new Error("User not found");
    }

    return this.sanitizeUser(user);
  }

  // Update user info (name, email, role)
  async updateUserInfo(userId, updates) {
    const { name, email, role } = updates;

    // Validate updates
    const updateData = {};

    if (name !== undefined) {
      if (!name || name.trim().length === 0) {
        throw new Error('Name cannot be empty');
      }
      updateData.name = name.trim();
    }

    if (email !== undefined) {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Invalid email format');
      }
      
      // Check if email already exists (excluding current user)
      const existingUser = await UserRepository.findByEmail(email);
      if (existingUser && existingUser._id.toString() !== userId) {
        throw new Error('Email already exists');
      }
      
      updateData.email = email.toLowerCase();
    }

    if (role !== undefined) {
      if (!['admin', 'teacher', 'student'].includes(role)) {
        throw new Error('Invalid role');
      }
      updateData.role = role;
    }

    // Check if there are any updates
    if (Object.keys(updateData).length === 0) {
      throw new Error('No valid updates provided');
    }

    const user = await UserRepository.update(userId, updateData);
    if (!user) {
      throw new Error('User not found');
    }

    return this.sanitizeUser(user);
  }

  // Reset user password
  async resetUserPassword(userId, newPassword) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Validate password
    if (!newPassword || newPassword.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    // Hash and update password
    const passwordHash = await PasswordHasher.hash(newPassword);
    await UserRepository.update(userId, { passwordHash });

    return { message: "Password reset successfully" };
  }

  // Get system metrics
  async getSystemMetrics() {
    const totalUsers = await UserRepository.count();
    const activeUsers = await UserRepository.count({ status: "active" });
    const students = await UserRepository.count({ role: "student" });
    const teachers = await UserRepository.count({ role: "teacher" });

    // You can add more metrics here like total classes, exams, etc.

    return {
      totalUsers,
      activeUsers,
      students,
      teachers,
    };
  }

  // Get exam statistics for admin
  async getExamStats(adminId) {
    const ExamRepository = require("../repositories/ExamRepository");
    const ExamSubmissionRepository = require("../repositories/ExamSubmissionRepository");
    const ContestRepository = require("../repositories/ContestRepository");

    // Get exams created by this admin
    const [allExams, totalContests] = await Promise.all([
      ExamRepository.count({ createdBy: adminId }),
      ContestRepository.count({ ownerId: adminId }),
    ]);

    // Get all exam IDs created by this admin
    const adminExams = await ExamRepository.find(
      { createdBy: adminId },
      { select: "_id" }
    );
    const examIds = adminExams.map((e) => e._id);

    // Count total submissions (participants) for these exams
    const totalParticipants =
      examIds.length > 0
        ? await ExamSubmissionRepository.count({
            examId: { $in: examIds },
            status: { $in: ["completed", "graded"] },
          })
        : 0;

    return {
      totalExams: allExams,
      contestExams: totalContests, // Now counting contests instead of contest-mode exams
      publicExams: allExams, // All exams created by admin
      totalParticipants,
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
