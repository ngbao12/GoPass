const AuthService = require('../services/AuthService');

class AuthController {
  // POST /auth/register
  async register(req, res) {
    try {
      const result = await AuthService.registerUser(req.body);
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // POST /auth/login
  async login(req, res) {
    try {
      const result = await AuthService.login(req.body);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  // POST /auth/refresh-token
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      const result = await AuthService.refreshToken(refreshToken);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  // POST /auth/forgot-password
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const result = await AuthService.generateResetPassword(email);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // POST /auth/reset-password
  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;
      const result = await AuthService.resetPassword(token, newPassword);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // POST /auth/logout
  async logout(req, res) {
    try {
      const { refreshToken } = req.body;
      const result = await AuthService.logout(refreshToken);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new AuthController();
