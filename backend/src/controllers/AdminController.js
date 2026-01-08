const AdminService = require('../services/AdminService');

class AdminController {
  async listUsers(req, res) {
    try {
      const result = await AdminService.listUsers(req.query);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getUserDetail(req, res) {
    try {
      const user = await AdminService.getUserDetail(req.params.userId);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  async updateUserStatus(req, res) {
    try {
      const user = await AdminService.updateUserStatus(req.params.userId, req.body.status);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateUserInfo(req, res) {
    try {
      const user = await AdminService.updateUserInfo(req.params.userId, req.body);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async resetUserPassword(req, res) {
    try {
      const { newPassword } = req.body;
      
      if (!newPassword) {
        return res.status(400).json({ 
          success: false, 
          message: 'New password is required' 
        });
      }

      const result = await AdminService.resetUserPassword(req.params.userId, newPassword);
      res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getSystemMetrics(req, res) {
    try {
      const metrics = await AdminService.getSystemMetrics();
      res.status(200).json({ success: true, data: metrics });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new AdminController();
