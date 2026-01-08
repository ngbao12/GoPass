const GradingService = require("../services/GradingService");

class GradingController {
  async gradeSubmissionAuto(req, res) {
    try {
      const result = await GradingService.gradeSubmissionAuto(
        req.params.submissionId,
        req.user.userId
      );
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async gradeAnswerManual(req, res) {
    try {
      const grading = await GradingService.gradeAnswerManual(
        req.params.answerId,
        req.user.userId,
        req.body
      );
      res.status(200).json({ success: true, data: grading });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getGradingDetail(req, res) {
    try {
      const detail = await GradingService.getGradingDetail(
        req.params.submissionId,
        req.user.userId
      );
      res.status(200).json({ success: true, data: detail });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  async aiSuggestScore(req, res) {
    try {
      const suggestion = await GradingService.requestAiSuggestion(
        req.params.answerId,
        req.user.userId
      );
      res.status(200).json({ success: true, data: suggestion });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  /**
   * Get all submissions for grading (teacher only)
   * GET /api/grading/submissions?subject=X&status=Y&classId=Z&examId=W
   */
  async getAllSubmissions(req, res) {
    try {
      const { subject, status, classId, examId } = req.query;
      const filters = {};
      if (subject) filters.subject = subject;
      if (status) filters.status = status;
      if (classId) filters.classId = classId;
      if (examId) filters.examId = examId;

      // Pass teacherId to filter submissions by exams created by this teacher
      // (unless scoped to specific class/exam)
      const teacherId = req.user?.userId;
      const submissions = await GradingService.getAllSubmissions(filters, teacherId);
      res.status(200).json({ success: true, data: submissions });
    } catch (error) {
      console.error("[GradingController] Get all submissions error:", error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  /**
   * Get submission detail with answers
   * GET /api/grading/submissions/:submissionId
   */
  async getSubmissionDetail(req, res) {
    try {
      const detail = await GradingService.getSubmissionDetailWithAnswers(
        req.params.submissionId
      );
      res.status(200).json({ success: true, data: detail });
    } catch (error) {
      console.error("[GradingController] Get submission detail error:", error);
      res.status(404).json({ success: false, message: error.message });
    }
  }

  /**
   * Auto-grade Ngữ Văn submission
   * POST /api/grading/submissions/:submissionId/auto-grade-ngu-van
   */
  async autoGradeNguVan(req, res) {
    try {
      const result = await GradingService.autoGradeNguVan(
        req.params.submissionId
      );
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("[GradingController] Auto-grade Ngữ Văn error:", error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  /**
   * Update submission status
   * PATCH /api/grading/submissions/:submissionId/status
   */
  async updateSubmissionStatus(req, res) {
    try {
      const { status } = req.body;
      const submission = await GradingService.updateSubmissionStatus(
        req.params.submissionId,
        status
      );
      res.status(200).json({ success: true, data: submission });
    } catch (error) {
      console.error("[GradingController] Update status error:", error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  /**
   * Grade a single answer manually
   * POST /api/grading/submissions/:submissionId/answers/:answerId/grade
   */
  async gradeAnswer(req, res) {
    try {
      const { score, feedback } = req.body;
      const answer = await GradingService.gradeAnswerManually(
        req.params.submissionId,
        req.params.answerId,
        { score, feedback }
      );
      res.status(200).json({ success: true, data: answer });
    } catch (error) {
      console.error("[GradingController] Grade answer error:", error);
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new GradingController();
