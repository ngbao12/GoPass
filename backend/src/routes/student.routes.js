const express = require('express');
const router = express.Router();
const { StudentController } = require('../controllers');
const { authenticate, authorize } = require('../middleware');

// All routes require authentication
router.use(authenticate);

// Student statistics endpoints (accessible by students and admins)
router.get('/stats', authorize('student', 'admin'), StudentController.getStudentStats);
router.get('/history', authorize('student', 'admin'), StudentController.getStudentHistory);
router.get('/activity', authorize('student', 'admin'), StudentController.getStudentActivity);
router.get('/subject-performance', authorize('student', 'admin'), StudentController.getSubjectPerformance);

// Student practice exams endpoint
router.get('/practice', authorize('student', 'admin'), StudentController.getPracticeExams);

// Student contests endpoint
router.get('/contests', authorize('student', 'admin'), StudentController.getStudentContests);

module.exports = router;
