const BaseRepository = require('./BaseRepository');
const Question = require('../models/Question');

class QuestionRepository extends BaseRepository {
  constructor() {
    super(Question);
  }

  async findBySubject(subject, options = {}) {
    return await this.find({ subject }, options);
  }

  async findByDifficulty(difficulty, options = {}) {
    return await this.find({ difficulty }, options);
  }

  async findByTags(tags, options = {}) {
    return await this.find({ tags: { $in: tags } }, options);
  }

  async searchQuestions(filter = {}) {
    const { subject, difficulty, tags, type, createdBy, keyword } = filter;
    const query = {};

    if (subject) query.subject = subject;
    if (difficulty) query.difficulty = difficulty;
    if (type) query.type = type;
    if (createdBy) query.createdBy = createdBy;
    if (tags && tags.length > 0) query.tags = { $in: tags };
    if (keyword) {
      query.$or = [
        { content: { $regex: keyword, $options: 'i' } },
      ];
    }

    return await this.find(query);
  }

  async findPublicQuestions(filter = {}) {
    return await this.find({ ...filter, isPublic: true });
  }

  async selectRandomQuestions(filter, count) {
    return await this.model.aggregate([
      { $match: filter },
      { $sample: { size: count } },
    ]);
  }
}

module.exports = new QuestionRepository();
