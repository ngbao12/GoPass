const UserRepository = require('../repositories/UserRepository');
const PasswordHasher = require('../providers/PasswordHasher');

class UserService {
  // Get user profile
  async getProfile(userId) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return this.sanitizeUser(user);
  }

  // Update user profile
  async updateProfile(userId, dto) {
    const { name, phone, avatar } = dto;

    // Build update object with allowed fields only
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (avatar !== undefined) updateData.avatar = avatar;

    const user = await UserRepository.update(userId, updateData);
    if (!user) {
      throw new Error('User not found');
    }

    return this.sanitizeUser(user);
  }

  // Change password
  async changePassword(userId, dto) {
    const { oldPassword, newPassword } = dto;

    // Get user
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify old password
    const isPasswordValid = await PasswordHasher.verify(oldPassword, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const passwordHash = await PasswordHasher.hash(newPassword);

    // Update password
    await UserRepository.update(userId, { passwordHash });

    return { message: 'Password changed successfully' };
  }

  // Update avatar (optional)
  async updateAvatar(userId, fileUrl) {
    const user = await UserRepository.update(userId, { avatar: fileUrl });
    if (!user) {
      throw new Error('User not found');
    }

    return this.sanitizeUser(user);
  }

  // Remove sensitive data
  sanitizeUser(user) {
    const userObj = user.toObject ? user.toObject() : user;
    delete userObj.passwordHash;
    return userObj;
  }
}

module.exports = new UserService();
