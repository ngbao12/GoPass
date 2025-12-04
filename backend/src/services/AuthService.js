const UserRepository = require('../repositories/UserRepository');
const JwtProvider = require('../providers/JwtProvider');
const PasswordHasher = require('../providers/PasswordHasher');
const MailProvider = require('../providers/MailProvider');

class AuthService {
  // Register new user
  async registerUser(dto) {
    const { name, email, password, role = 'student' } = dto;

    // Check if email already exists
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Hash password
    const passwordHash = await PasswordHasher.hash(password);

    // Create user
    const user = await UserRepository.create({
      name,
      email,
      passwordHash,
      role,
      status: 'active',
    });

    // Generate tokens
    const tokens = this.generateTokens(user);

    // Send welcome email (async, don't wait)
    MailProvider.sendWelcomeEmail(user).catch(err => 
      console.error('Failed to send welcome email:', err)
    );

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  // Login user
  async login(dto) {
    const { email, password } = dto;

    // Find user by email
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await PasswordHasher.verify(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Check user status
    if (user.status === 'locked') {
      throw new Error('Account is locked. Please contact administrator');
    }

    // Generate tokens
    const tokens = this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  // Refresh access token
  async refreshToken(refreshToken) {
    try {
      // Verify refresh token
      const decoded = JwtProvider.verifyRefreshToken(refreshToken);

      // Get user
      const user = await UserRepository.findById(decoded.userId);
      if (!user || user.status !== 'active') {
        throw new Error('Invalid token');
      }

      // Generate new tokens
      return this.generateTokens(user);
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  // Generate reset password token and send email
  async generateResetPassword(email) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      // Don't reveal if email exists
      return { message: 'If the email exists, a reset link has been sent' };
    }

    // Generate reset token
    const resetToken = JwtProvider.generateResetPasswordToken(user._id);

    // Send reset email
    await MailProvider.sendResetPasswordMail(user, resetToken);

    return { message: 'Reset password email sent successfully' };
  }

  // Reset password with token
  async resetPassword(token, newPassword) {
    try {
      // Verify token
      const decoded = JwtProvider.verifyResetPasswordToken(token);

      // Hash new password
      const passwordHash = await PasswordHasher.hash(newPassword);

      // Update user password
      await UserRepository.update(decoded.userId, { passwordHash });

      // Get user for notification
      const user = await UserRepository.findById(decoded.userId);

      // Send notification
      MailProvider.sendPasswordChangedNotification(user).catch(err =>
        console.error('Failed to send password changed email:', err)
      );

      return { message: 'Password reset successfully' };
    } catch (error) {
      throw new Error('Invalid or expired reset token');
    }
  }

  // Logout (optional - for token blacklisting)
  async logout(refreshToken) {
    // In a production app, you might want to blacklist the refresh token
    // For now, just return success
    return { message: 'Logged out successfully' };
  }

  // Generate tokens
  generateTokens(user) {
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: JwtProvider.generateAccessToken(payload),
      refreshToken: JwtProvider.generateRefreshToken(payload),
    };
  }

  // Remove sensitive data
  sanitizeUser(user) {
    const userObj = user.toObject ? user.toObject() : user;
    delete userObj.passwordHash;
    return userObj;
  }
}

module.exports = new AuthService();
