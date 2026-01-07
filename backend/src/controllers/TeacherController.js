const TeacherService = require('../services/TeacherService');

class TeacherController {
  /**
   * GET /teachers/stats
   * Get teacher dashboard statistics
   */
  async getStats(req, res) {
    try {
      const teacherId = req.user.userId;
      const stats = await TeacherService.getTeacherStats(teacherId);
      
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('Error in getStats:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch teacher statistics',
      });
    }
  }

  /**
   * GET /teachers/classes/overview
   * Get teacher's classes with student and pending request counts
   */
  async getClassesOverview(req, res) {
    try {
      const teacherId = req.user.userId;
      const classes = await TeacherService.getClassesOverview(teacherId);
      
      res.status(200).json({
        success: true,
        data: classes,
      });
    } catch (error) {
      console.error('Error in getClassesOverview:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch classes overview',
      });
    }
  }

  /**
   * GET /teachers/activities
   * Get recent teacher activities (placeholder for future implementation)
   */
  async getActivities(req, res) {
    try {
      const teacherId = req.user.userId;
      const activities = await TeacherService.getRecentActivities(teacherId);
      
      res.status(200).json({
        success: true,
        data: activities,
      });
    } catch (error) {
      console.error('Error in getActivities:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch activities',
      });
    }
  }
}

module.exports = new TeacherController()