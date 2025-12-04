const BaseRepository = require('./BaseRepository');
const ExamQuestion = require('../models/ExamQuestion');

class ExamQuestionRepository extends BaseRepository {
  constructor() {
    super(ExamQuestion);
  }

  async findByExam(examId, options = {}) {
    return await this.find({ examId }, { ...options, sort: { order: 1 } });
  }

  async findByQuestion(questionId) {
    return await this.find({ questionId });
  }

  async deleteByExam(examId) {
    return await this.model.deleteMany({ examId });
  }

  async getNextOrder(examId) {
    const lastQuestion = await this.model
      .findOne({ examId })
      .sort({ order: -1 });
    
    return lastQuestion ? lastQuestion.order + 1 : 1;
  }

  async countExamQuestions(examId) {
    return await this.count({ examId });
  }

  async calculateTotalScore(examId) {
    const questions = await this.find({ examId });
    return questions.reduce((sum, q) => sum + q.maxScore, 0);
  }
}

module.exports = new ExamQuestionRepository();
