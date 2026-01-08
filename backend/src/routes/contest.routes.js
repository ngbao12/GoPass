const express = require("express");
const router = express.Router();
const ContestController = require("../controllers/ContestController");
const { authenticate, authorize } = require("../middleware");

// ====== ADMIN/TEACHER ROUTES (must be BEFORE /:contestId) ======
// Get all contests (admin/teacher only, requires auth)
router.get(
  "/",
  authenticate,
  authorize("teacher", "admin"),
  ContestController.getAllContests
);

// Create contest (admin/teacher only, requires auth)
router.post(
  "/",
  authenticate,
  authorize("teacher", "admin"),
  ContestController.createContest
);

// ====== PUBLIC ROUTES (no auth required) ======
// Get contest detail - public (anyone can view)
router.get("/:contestId", ContestController.getContestDetail);

// Get contest leaderboard - public
router.get("/:contestId/leaderboard", ContestController.getLeaderboard);

// ====== AUTHENTICATED USER ROUTES ======
// Join contest (any authenticated user)
router.post("/:contestId/join", authenticate, ContestController.joinContest);

// ====== ADMIN/TEACHER MANAGEMENT ROUTES ======
// Update contest
router.put(
  "/:contestId",
  authenticate,
  authorize("teacher", "admin"),
  ContestController.updateContest
);

// Delete contest
router.delete(
  "/:contestId",
  authenticate,
  authorize("teacher", "admin"),
  ContestController.deleteContest
);

// Add exam to contest
router.post(
  "/:contestId/exams",
  authenticate,
  authorize("teacher", "admin"),
  ContestController.addExamToContest
);

// Remove exam from contest
router.delete(
  "/:contestId/exams/:contestExamId",
  authenticate,
  authorize("teacher", "admin"),
  ContestController.removeExamFromContest
);

module.exports = router;
