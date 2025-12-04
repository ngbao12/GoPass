const GradingService = require('../services/GradingService');

class GradingController {
  async gradeSubmissionAuto(req, res) {
    try {
      const result = await GradingService.gradeSubmissionAuto(req.params.submissionId, req.user.userId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async gradeAnswerManual(req, res) {
    try {
      const grading = await GradingService.gradeAnswerManual(req.params.answerId, req.user.userId, req.body);
      res.status(200).json({ success: true, data: grading });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getGradingDetail(req, res) {
    try {
      const detail = await GradingService.getGradingDetail(req.params.submissionId, req.user.userId);
      res.status(200).json({ success: true, data: detail });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  async aiSuggestScore(req, res) {
    try {
      const suggestion = await GradingService.requestAiSuggestion(req.params.answerId, req.user.userId);
      res.status(200).json({ success: true, data: suggestion });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new GradingController();
