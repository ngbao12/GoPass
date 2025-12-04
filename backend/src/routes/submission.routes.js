const express = require('express');
const router = express.Router();
const SubmissionController = require('../controllers/SubmissionController');
const { authenticate, authorize } = require('../middleware');

// All routes require authentication
router.use(authenticate);

// Student routes
router.post('/assignments/:assignmentId/start', authorize('student'), SubmissionController.startExam);
router.post('/:submissionId/answers', authorize('student'), SubmissionController.saveAnswer);
router.post('/:submissionId/auto-save', authorize('student'), SubmissionController.autoSave);
router.post('/:submissionId/submit', authorize('student'), SubmissionController.submitExam);
router.get('/assignments/:assignmentId/my-submission', authorize('student'), SubmissionController.getMySubmission);

// Shared routes (student can view own, teacher can view students')
router.get('/:submissionId', SubmissionController.getSubmissionDetail);

module.exports = router;
