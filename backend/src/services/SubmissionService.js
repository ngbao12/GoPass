const ExamSubmissionRepository = require('../repositories/ExamSubmissionRepository');
const ExamAnswerRepository = require('../repositories/ExamAnswerRepository');
const ExamAssignmentRepository = require('../repositories/ExamAssignmentRepository');
const ExamRepository = require('../repositories/ExamRepository');
const ExamQuestionRepository = require('../repositories/ExamQuestionRepository');
const ClassMemberRepository = require('../repositories/ClassMemberRepository');

class SubmissionService {
  // Start exam
  async startExam(assignmentId, studentId) {
    const assignment = await ExamAssignmentRepository.findById(assignmentId);
    if (!assignment) {
      throw new Error('Assignment not found');
    }

    // Check if assignment is active
    const now = new Date();
    if (now < assignment.startTime) {
      throw new Error('Exam has not started yet');
    }
    if (now > assignment.endTime && !assignment.allowLateSubmission) {
      throw new Error('Exam has ended');
    }

    // Check if student is member of the class
    const isMember = await ClassMemberRepository.isMember(assignment.classId, studentId);
    if (!isMember) {
      throw new Error('You are not a member of this class');
    }

    // Check existing submissions
    const existingSubmission = await ExamSubmissionRepository.findInProgressSubmission(
      assignmentId,
      studentId
    );

    if (existingSubmission) {
      return existingSubmission;
    }

    // Check attempts
    const attempts = await ExamSubmissionRepository.getStudentAttempts(assignmentId, studentId);
    if (attempts >= assignment.maxAttempts) {
      throw new Error('Maximum attempts reached');
    }

    // Calculate max score
    const maxScore = await ExamQuestionRepository.calculateTotalScore(assignment.examId);

    // Create new submission
    const submission = await ExamSubmissionRepository.create({
      assignmentId,
      examId: assignment.examId,
      studentId,
      status: 'in_progress',
      maxScore,
      attemptNumber: attempts + 1,
    });

    return submission;
  }

  // Save answer
  async saveAnswer(submissionId, dto) {
    const { questionId, answerText, selectedOptions } = dto;

    const submission = await ExamSubmissionRepository.findById(submissionId);
    if (!submission) {
      throw new Error('Submission not found');
    }

    if (submission.status !== 'in_progress') {
      throw new Error('Cannot save answer for submitted exam');
    }

    // Get question max score
    const examQuestion = await ExamQuestionRepository.findOne({
      examId: submission.examId,
      questionId,
    });

    const answer = await ExamAnswerRepository.upsertAnswer(submissionId, questionId, {
      answerText,
      selectedOptions,
      maxScore: examQuestion?.maxScore || 1,
    });

    return answer;
  }

  // Auto-save batch of answers
  async autoSave(submissionId, answers) {
    const results = [];

    for (const answerDto of answers) {
      const answer = await this.saveAnswer(submissionId, answerDto);
      results.push(answer);
    }

    return results;
  }

  // Submit exam
  async submitExam(submissionId, studentId) {
    const submission = await ExamSubmissionRepository.findById(submissionId);
    if (!submission) {
      throw new Error('Submission not found');
    }

    if (submission.studentId.toString() !== studentId.toString()) {
      throw new Error('Unauthorized');
    }

    if (submission.status !== 'in_progress') {
      throw new Error('Exam already submitted');
    }

    // Update submission status
    await ExamSubmissionRepository.submitSubmission(submissionId);

    // Trigger auto-grading (in real app, this could be async/queued)
    // For now, we'll let GradingService handle it

    return { message: 'Exam submitted successfully' };
  }

  // Get submission detail
  async getSubmissionDetail(submissionId, userId) {
    const submission = await ExamSubmissionRepository.findById(submissionId);
    if (!submission) {
      throw new Error('Submission not found');
    }

    // Get answers
    const answers = await ExamAnswerRepository.findBySubmission(submissionId, {
      populate: 'questionId',
    });

    return {
      ...submission.toObject(),
      answers,
    };
  }

  // Get or create submission for assignment
  async getOrCreateSubmission(assignmentId, studentId) {
    let submission = await ExamSubmissionRepository.findInProgressSubmission(
      assignmentId,
      studentId
    );

    if (!submission) {
      submission = await this.startExam(assignmentId, studentId);
    }

    return submission;
  }

  // Get all submissions for current student
  async getMySubmissions(studentId, query = {}) {
    const { examId, contestId, status, page = 1, limit = 20 } = query;
    
    const filter = { studentUserId: studentId };
    if (examId) filter.examId = examId;
    if (contestId) filter.contestId = contestId;
    if (status) filter.status = status;

    const submissions = await ExamSubmissionRepository.find(filter, {
      populate: ['examId', 'classId', 'contestId'],
      sort: { submittedAt: -1, createdAt: -1 },
      skip: (page - 1) * limit,
      limit: parseInt(limit)
    });

    return submissions;
  }
}

module.exports = new SubmissionService();
