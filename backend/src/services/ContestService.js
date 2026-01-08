const mongoose = require("mongoose");
const ContestRepository = require("../repositories/ContestRepository");
const ContestExamRepository = require("../repositories/ContestExamRepository");
const ContestParticipationRepository = require("../repositories/ContestParticipationRepository");
const ExamSubmissionRepository = require("../repositories/ExamSubmissionRepository");

class ContestService {
  // Get all contests (admin/teacher) - filtered by owner
  async getAllContests(userId) {
    const contests = await ContestRepository.findByOwner(userId, {
      sort: { createdAt: -1 },
    });
    return contests;
  }

  // Create contest
  async createContest(ownerId, dto) {
    const { name, description, startTime, endTime, isPublic, exams } = dto;

    // Calculate status based on time
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    let status = "upcoming";
    if (now >= start && now <= end) {
      status = "ongoing";
    } else if (now > end) {
      status = "ended";
    }

    const contest = await ContestRepository.create({
      name,
      description,
      startTime,
      endTime,
      ownerId,
      isPublic: isPublic !== undefined ? isPublic : true,
      status,
    });

    // Create ContestExam records if exams are provided
    if (exams && Array.isArray(exams) && exams.length > 0) {
      console.log(`[ContestService] Creating ${exams.length} contest exams`);

      const contestExamPromises = exams.map((exam) =>
        ContestExamRepository.create({
          contestId: contest._id,
          examId: exam.examId,
          order: exam.order,
          weight: exam.weight || 1,
        })
      );

      await Promise.all(contestExamPromises);
      console.log(
        `[ContestService] Successfully created ${exams.length} contest exams`
      );
    }

    return contest;
  }

  // Get contest detail
  async getContestDetail(contestId, userId) {
    const contest = await ContestRepository.findById(contestId);
    if (!contest) {
      throw new Error("Contest not found");
    }

    const exams = await ContestExamRepository.findByContest(contestId, {
      populate: "examId",
    });

    console.log(
      `[ContestService] Found ${exams.length} exams for contest ${contestId}`
    );
    console.log(
      "[ContestService] Exams before filter:",
      exams.map((e) => ({
        _id: e._id,
        examId: e.examId ? e.examId._id : null,
        examTitle: e.examId ? e.examId.title : "NULL",
        order: e.order,
      }))
    );

    // Filter out exams where examId is null (deleted exams)
    const validExams = exams.filter((exam) => exam.examId !== null);

    console.log(
      `[ContestService] ${validExams.length} valid exams after filtering nulls`
    );

    // Participation of current user (if any)
    const participation = userId
      ? await ContestParticipationRepository.findParticipation(
          contestId,
          userId
        )
      : null;

    return {
      ...contest.toObject(),
      exams: validExams,
      participation,
    };
  }

  // Update contest
  async updateContest(contestId, ownerId, dto) {
    const contest = await ContestRepository.findById(contestId);
    if (!contest) {
      throw new Error("Contest not found");
    }

    if (contest.ownerId.toString() !== ownerId.toString()) {
      throw new Error("Unauthorized to update this contest");
    }

    const allowedFields = [
      "name",
      "description",
      "startTime",
      "endTime",
      "isPublic",
      "status",
    ];
    const updateData = {};
    allowedFields.forEach((field) => {
      if (dto[field] !== undefined) updateData[field] = dto[field];
    });

    return await ContestRepository.update(contestId, updateData);
  }

  // Delete contest
  async deleteContest(contestId, ownerId) {
    const contest = await ContestRepository.findById(contestId);
    if (!contest) {
      throw new Error("Contest not found");
    }

    if (contest.ownerId.toString() !== ownerId.toString()) {
      throw new Error("Unauthorized to delete this contest");
    }

    await ContestExamRepository.deleteByContest(contestId);
    await ContestRepository.delete(contestId);

    return { message: "Contest deleted successfully" };
  }

  // Add exam to contest
  async addExamToContest(contestId, examId, ownerId) {
    const contest = await ContestRepository.findById(contestId);
    if (!contest) {
      throw new Error("Contest not found");
    }

    if (contest.ownerId.toString() !== ownerId.toString()) {
      throw new Error("Unauthorized");
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
      throw new Error("Unauthorized");
    }

    await ContestExamRepository.delete(contestExamId);
    return { message: "Exam removed from contest" };
  }

  // Get leaderboard
  async getLeaderboard(contestId) {
    const contest = await ContestRepository.findById(contestId);
    if (!contest) {
      throw new Error("Contest not found");
    }

    // Get all exams in contest
    const contestExams = await ContestExamRepository.findByContest(contestId);
    const examIds = contestExams.map((ce) => ce.examId);

    // Get all submissions for these exams
    const submissions = await ExamSubmissionRepository.find(
      {
        examId: { $in: examIds },
        status: "graded",
      },
      { populate: "studentUserId" }
    );

    // Group by student and calculate total score
    const studentScores = {};

    for (const submission of submissions) {
      const studentUserId = submission.studentUserId._id.toString();

      if (!studentScores[studentUserId]) {
        studentScores[studentUserId] = {
          student: submission.studentUserId,
          totalScore: 0,
          examsCompleted: 0,
        };
      }

      studentScores[studentUserId].totalScore += submission.totalScore;
      studentScores[studentUserId].examsCompleted += 1;
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

  // Student joins contest
  async joinContest(contestId, userId) {
    const contest = await ContestRepository.findById(contestId);
    if (!contest) {
      throw new Error("Contest not found");
    }

    // Already joined
    const existing = await ContestParticipationRepository.findParticipation(
      contestId,
      userId
    );
    if (existing) return existing;

    const participation = await ContestParticipationRepository.create({
      contestId: new mongoose.Types.ObjectId(contestId),
      userId: new mongoose.Types.ObjectId(userId),
      enrolledAt: new Date(),
      totalScore: 0,
      rank: null,
      percentile: null,
      completedExams: [],
    });

    // Increment participants count (best-effort)
    const currentCount = contest.participantsCount || 0;
    await ContestRepository.update(contestId, {
      participantsCount: currentCount + 1,
    });

    return participation;
  }
}

module.exports = new ContestService();
