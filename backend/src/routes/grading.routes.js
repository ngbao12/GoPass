const express = require("express");
const router = express.Router();
const GradingController = require("../controllers/GradingController");
const { authenticate, authorize } = require("../middleware");

router.use(authenticate);

// Teacher routes - Get all submissions for grading
router.get(
  "/submissions",
  authorize("teacher"),
  GradingController.getAllSubmissions
);

// Get submission detail with answers
router.get(
  "/submissions/:submissionId",
  GradingController.getSubmissionDetail
);

// Teacher routes
router.post(
  "/submissions/:submissionId/grade-auto",
  authorize("teacher"),
  GradingController.gradeSubmissionAuto
);
router.post(
  "/submissions/:submissionId/auto-grade-ngu-van",
  GradingController.autoGradeNguVan
); // Tự động chấm khi submit
router.post(
  "/answers/:answerId/grade-manual",
  authorize("teacher"),
  GradingController.gradeAnswerManual
);
router.post(
  "/answers/:answerId/ai-suggest",
  authorize("teacher"),
  GradingController.aiSuggestScore
);

// Update submission status
router.patch(
  "/submissions/:submissionId/status",
  authorize("teacher"),
  GradingController.updateSubmissionStatus
);

// Grade individual answer
router.post(
  "/submissions/:submissionId/answers/:answerId/grade",
  authorize("teacher"),
  GradingController.gradeAnswer
);

// Shared routes
router.get(
  "/submissions/:submissionId/grade",
  GradingController.getGradingDetail
);

module.exports = router;
