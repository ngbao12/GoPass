const QuestionBankService = require('../services/QuestionBankService');

class QuestionBankController {
  async createQuestion(req, res) {
    try {
      const question = await QuestionBankService.createQuestion(req.user.userId, req.body);
      res.status(201).json({ success: true, data: question });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getQuestionDetail(req, res) {
    try {
      const question = await QuestionBankService.getQuestionDetail(req.params.questionId);
      res.status(200).json({ success: true, data: question });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  async updateQuestion(req, res) {
    try {
      const question = await QuestionBankService.updateQuestion(req.params.questionId, req.user.userId, req.body);
      res.status(200).json({ success: true, data: question });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteQuestion(req, res) {
    try {
      const result = await QuestionBankService.deleteQuestion(req.params.questionId, req.user.userId);
      res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async searchQuestions(req, res) {
    try {
      const result = await QuestionBankService.searchQuestions(req.query);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async selectQuestionsForExam(req, res) {
    try {
      const questions = await QuestionBankService.selectQuestions(req.body);
      res.status(200).json({ success: true, data: questions });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new QuestionBankController();
