const jwt = require('jsonwebtoken');
const config = require('../config');

class JwtProvider {
  generateAccessToken(payload) {
    return jwt.sign(
      payload,
      config.jwt.accessSecret,
      { expiresIn: config.jwt.accessExpiresIn }
    );
  }

  generateRefreshToken(payload) {
    return jwt.sign(
      payload,
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn }
    );
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, config.jwt.accessSecret);
    } catch (error) {
      throw new Error('Invalid or expired access token');
    }
  }

  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, config.jwt.refreshSecret);
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  generateResetPasswordToken(userId) {
    return jwt.sign(
      { userId, type: 'reset_password' },
      config.jwt.accessSecret,
      { expiresIn: '1h' }
    );
  }

  verifyResetPasswordToken(token) {
    try {
      const decoded = jwt.verify(token, config.jwt.accessSecret);
      if (decoded.type !== 'reset_password') {
        throw new Error('Invalid token type');
      }
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired reset password token');
    }
  }
}

module.exports = new JwtProvider();
