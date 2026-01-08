const express = require('express');
const router = express.Router();
const TeacherController = require('../controllers/TeacherController');
const { authenticate, authorize } = require('../middleware');

// All routes require authentication and teacher role
router.use(authenticate);
router.use(authorize('teacher'));

// Teacher dashboard stats
router.get('/stats', TeacherController.getStats);

// Teacher classes overview (for dashboard)
router.get('/classes/overview', TeacherController.getClassesOverview);

// Teacher activities (placeholder for future implementation)
router.get('/activities', TeacherController.getActivities);

module.exports = router;