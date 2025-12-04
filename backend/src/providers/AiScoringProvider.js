const axios = require('axios');
const config = require('../config');

class AiScoringProvider {
  constructor() {
    this.apiUrl = config.aiScoring.apiUrl;
    this.apiKey = config.aiScoring.apiKey;
  }

  async scoreEssayAnswer(answerContent, questionContent, criteria = {}) {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          question: questionContent,
          answer: answerContent,
          criteria: {
            maxScore: criteria.maxScore || 10,
            subject: criteria.subject || 'general',
            difficulty: criteria.difficulty || 'medium',
            ...criteria,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          timeout: 30000, // 30 seconds timeout
        }
      );

      return {
        score: response.data.score || 0,
        feedback: response.data.feedback || '',
        suggestions: response.data.suggestions || [],
        confidence: response.data.confidence || 0,
      };
    } catch (error) {
      console.error('AI Scoring Error:', error.message);
      
      // Return default scoring if AI service fails
      return {
        score: 0,
        feedback: 'AI scoring service is currently unavailable. Please grade manually.',
        suggestions: [],
        confidence: 0,
        error: true,
      };
    }
  }

  async batchScoreAnswers(answers) {
    const results = [];
    
    for (const answer of answers) {
      const result = await this.scoreEssayAnswer(
        answer.answerContent,
        answer.questionContent,
        answer.criteria
      );
      results.push({
        answerId: answer.answerId,
        ...result,
      });
    }

    return results;
  }

  async validateAnswer(answerContent, expectedAnswer, type = 'short_answer') {
    // Simple validation logic for short answers
    if (type === 'short_answer') {
      const normalizedAnswer = answerContent.trim().toLowerCase();
      const normalizedExpected = expectedAnswer.trim().toLowerCase();
      
      return {
        isCorrect: normalizedAnswer === normalizedExpected,
        similarity: this.calculateSimilarity(normalizedAnswer, normalizedExpected),
      };
    }

    return {
      isCorrect: false,
      similarity: 0,
    };
  }

  calculateSimilarity(str1, str2) {
    // Simple Levenshtein distance-based similarity
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));

    for (let i = 0; i <= len1; i++) matrix[i][0] = i;
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }

    const maxLen = Math.max(len1, len2);
    return maxLen === 0 ? 1 : (maxLen - matrix[len1][len2]) / maxLen;
  }
}

module.exports = new AiScoringProvider();
