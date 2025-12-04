const BaseRepository = require('./BaseRepository');
const ExamAnswer = require('../models/ExamAnswer');

class ExamAnswerRepository extends BaseRepository {
  constructor() {
    super(ExamAnswer);
  }

  async findBySubmission(submissionId, options = {}) {
    return await this.find({ submissionId }, options);
  }

  async findAnswer(submissionId, questionId) {
    return await this.findOne({ submissionId, questionId });
  }

  async upsertAnswer(submissionId, questionId, answerData) {
    return await this.model.findOneAndUpdate(
      { submissionId, questionId },
      { ...answerData, submissionId, questionId },
      { new: true, upsert: true, runValidators: true }
    );
  }

  async gradeAnswer(answerId, score, feedback = '', isAutoGraded = false) {
    return await this.update(answerId, {
      score,
      feedback,
      isAutoGraded,
      isManuallyGraded: !isAutoGraded,
    });
  }

  async deleteBySubmission(submissionId) {
    return await this.model.deleteMany({ submissionId });
  }

  async countAnsweredQuestions(submissionId) {
    return await this.count({
      submissionId,
      $or: [
        { answerText: { $exists: true, $ne: '' } },
        { selectedOptions: { $exists: true, $ne: [] } },
      ],
    });
  }
}

module.exports = new ExamAnswerRepository();
