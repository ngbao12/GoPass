const UserService = require('../services/UserService');

class UserController {
  // GET /users/me
  async getProfile(req, res) {
    try {
      const userId = req.user.userId;
      const user = await UserService.getProfile(userId);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // PUT /users/me
  async updateProfile(req, res) {
    try {
      const userId = req.user.userId;
      const user = await UserService.updateProfile(userId, req.body);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // PUT /users/me/change-password
  async changePassword(req, res) {
    try {
      const userId = req.user.userId;
      const result = await UserService.changePassword(userId, req.body);
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

  // PUT /users/me/avatar
  async updateAvatar(req, res) {
    try {
      const userId = req.user.userId;
      // Assuming file URL is provided or uploaded
      const fileUrl = req.body.avatar || req.file?.path;
      const user = await UserService.updateAvatar(userId, fileUrl);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new UserController();
