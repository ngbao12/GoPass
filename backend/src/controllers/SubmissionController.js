const SubmissionService = require('../services/SubmissionService');

class SubmissionController {
  async startExam(req, res) {
    try {
      const submission = await SubmissionService.startExam(req.params.assignmentId, req.user.userId);
      res.status(201).json({ success: true, data: submission });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async saveAnswer(req, res) {
    try {
      const answer = await SubmissionService.saveAnswer(req.params.submissionId, req.body);
      res.status(200).json({ success: true, data: answer });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async autoSave(req, res) {
    try {
      const answers = await SubmissionService.autoSave(req.params.submissionId, req.body.answers);
      res.status(200).json({ success: true, data: answers });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async submitExam(req, res) {
    try {
      const result = await SubmissionService.submitExam(req.params.submissionId, req.user.userId);
      res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getSubmissionDetail(req, res) {
    try {
      const submission = await SubmissionService.getSubmissionDetail(req.params.submissionId, req.user.userId);
      res.status(200).json({ success: true, data: submission });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  async getMySubmission(req, res) {
    try {
      const submission = await SubmissionService.getOrCreateSubmission(req.params.assignmentId, req.user.userId);
      res.status(200).json({ success: true, data: submission });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new SubmissionController();
