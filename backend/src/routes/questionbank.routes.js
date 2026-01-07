const express = require('express');
const router = express.Router();
const QuestionBankController = require('../controllers/QuestionBankController');
const { authenticate, authorize } = require('../middleware');

// All routes require authentication and teacher/admin role
router.use(authenticate);
router.use(authorize('teacher', 'admin'));

router.post('/', QuestionBankController.createQuestion);
router.get('/stats', QuestionBankController.getQuestionStats);
router.get('/:questionId', QuestionBankController.getQuestionDetail);
router.put('/:questionId', QuestionBankController.updateQuestion);
router.delete('/:questionId', QuestionBankController.deleteQuestion);
router.get('/', QuestionBankController.searchQuestions);
router.post('/select-for-exam', QuestionBankController.selectQuestionsForExam);

module.exports = router;
