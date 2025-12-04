const ContestRepository = require('../repositories/ContestRepository');
const ContestExamRepository = require('../repositories/ContestExamRepository');
const ExamSubmissionRepository = require('../repositories/ExamSubmissionRepository');

class ContestService {
  // Create contest
  async createContest(ownerId, dto) {
    const { name, description, startTime, endTime, isPublic } = dto;

    const contest = await ContestRepository.create({
      name,
      description,
      startTime,
      endTime,
      ownerId,
      isPublic: isPublic !== undefined ? isPublic : true,
      status: 'upcoming',
    });

    return contest;
  }

  // Get contest detail
  async getContestDetail(contestId, userId) {
    const contest = await ContestRepository.findById(contestId);
    if (!contest) {
      throw new Error('Contest not found');
    }

    const exams = await ContestExamRepository.findByContest(contestId, {
      populate: 'examId',
    });

    return {
      ...contest.toObject(),
      exams,
    };
  }

  // Update contest
  async updateContest(contestId, ownerId, dto) {
    const contest = await ContestRepository.findById(contestId);
    if (!contest) {
      throw new Error('Contest not found');
    }

    if (contest.ownerId.toString() !== ownerId.toString()) {
      throw new Error('Unauthorized to update this contest');
    }

    const allowedFields = ['name', 'description', 'startTime', 'endTime', 'isPublic', 'status'];
    const updateData = {};
    allowedFields.forEach(field => {
      if (dto[field] !== undefined) updateData[field] = dto[field];
    });

    return await ContestRepository.update(contestId, updateData);
  }

  // Delete contest
  async deleteContest(contestId, ownerId) {
    const contest = await ContestRepository.findById(contestId);
    if (!contest) {
      throw new Error('Contest not found');
    }

    if (contest.ownerId.toString() !== ownerId.toString()) {
      throw new Error('Unauthorized to delete this contest');
    }

    await ContestExamRepository.deleteByContest(contestId);
    await ContestRepository.delete(contestId);

    return { message: 'Contest deleted successfully' };
  }

  // Add exam to contest
  async addExamToContest(contestId, examId, ownerId) {
    const contest = await ContestRepository.findById(contestId);
    if (!contest) {
      throw new Error('Contest not found');
    }

    if (contest.ownerId.toString() !== ownerId.toString()) {
      throw new Error('Unauthorized');
    }

    const order = await ContestExamRepository.getNextOrder(contestId);

    const contestExam = await ContestExamRepository.create({
      contestId,
      examId,
      order,
      weight: 1,
    });

    return contestExam;
  }

  // Remove exam from contest
  async removeExamFromContest(contestId, contestExamId, ownerId) {
    const contest = await ContestRepository.findById(contestId);
    if (!contest || contest.ownerId.toString() !== ownerId.toString()) {
      throw new Error('Unauthorized');
    }

    await ContestExamRepository.delete(contestExamId);
    return { message: 'Exam removed from contest' };
  }

  // Get leaderboard
  async getLeaderboard(contestId) {
    const contest = await ContestRepository.findById(contestId);
    if (!contest) {
      throw new Error('Contest not found');
    }

    // Get all exams in contest
    const contestExams = await ContestExamRepository.findByContest(contestId);
    const examIds = contestExams.map(ce => ce.examId);

    // Get all submissions for these exams
    const submissions = await ExamSubmissionRepository.find({
      examId: { $in: examIds },
      status: 'graded',
    }, { populate: 'studentId' });

    // Group by student and calculate total score
    const studentScores = {};

    for (const submission of submissions) {
      const studentId = submission.studentId._id.toString();
      
      if (!studentScores[studentId]) {
        studentScores[studentId] = {
          student: submission.studentId,
          totalScore: 0,
          examsCompleted: 0,
        };
      }

      studentScores[studentId].totalScore += submission.totalScore;
      studentScores[studentId].examsCompleted += 1;
    }

    // Convert to array and sort by total score
    const leaderboard = Object.values(studentScores)
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((entry, index) => ({
        rank: index + 1,
        student: entry.student,
        totalScore: entry.totalScore,
        examsCompleted: entry.examsCompleted,
      }));

    return leaderboard;
  }
}

module.exports = new ContestService();
