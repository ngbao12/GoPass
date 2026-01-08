const ExamService = require("../services/ExamService");
const path = require("path");

class ExamController {
  async getAllExams(req, res) {
    try {
      const { page = 1, limit = 50, subject, mode, search } = req.query;
      const result = await ExamService.getAllExams(req.user.userId, {
        page: Number(page),
        limit: Number(limit),
        subject,
        mode,
        search,
      });
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getPublishedExams(req, res) {
    try {
      const { page = 1, limit = 50, subject, mode, search } = req.query;
      const result = await ExamService.getPublishedExams(req.user.userId, {
        page: Number(page),
        limit: Number(limit),
        subject,
        mode,
        search,
      });
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async createExam(req, res) {
    try {
      const exam = await ExamService.createExam(req.user.userId, req.body);
      res.status(201).json({ success: true, data: exam });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async uploadExamFile(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Không có file được upload",
        });
      }

      // Return file information
      const fileInfo = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: `/uploads/exams/${req.file.filename}`,
        size: req.file.size,
        mimetype: req.file.mimetype,
      };

      res.status(200).json({
        success: true,
        data: fileInfo,
        message: "Upload file thành công",
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getExamDetail(req, res) {
    try {
      const { assignmentId, contestId, preview } = req.query;
      const isPreview = preview === "true";

      const exam = await ExamService.getExamDetail(
        req.params.examId,
        req.user.userId,
        false, // includeAnswers
        assignmentId || null,
        contestId || null,
        isPreview // skip submission lookup for preview
      );
      res.status(200).json({ success: true, data: exam });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  async getMyExams(req, res) {
    try {
      const { page = 1, limit = 10, subject, isPublished } = req.query;
      const exams = await ExamService.getTeacherExams(req.user.userId, {
        page: Number(page),
        limit: Number(limit),
        subject,
        isPublished,
      });
      res.status(200).json({ success: true, data: exams });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateExam(req, res) {
    try {
      const exam = await ExamService.updateExam(
        req.params.examId,
        req.user.userId,
        req.body
      );
      res.status(200).json({ success: true, data: exam });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteExam(req, res) {
    try {
      const result = await ExamService.deleteExam(
        req.params.examId,
        req.user.userId
      );
      res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async addQuestionsToExam(req, res) {
    try {
      const questions = await ExamService.addQuestions(
        req.params.examId,
        req.user.userId,
        req.body.questions
      );
      res.status(201).json({ success: true, data: questions });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async removeQuestionFromExam(req, res) {
    try {
      const result = await ExamService.removeQuestion(
        req.params.examId,
        req.user.userId,
        req.params.examQuestionId
      );
      res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async assignExamToClass(req, res) {
    try {
      const assignment = await ExamService.assignToClass(
        req.params.examId,
        req.body.classId,
        req.user.userId,
        req.body
      );
      res.status(201).json({ success: true, data: assignment });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async generateExamFromBank(req, res) {
    try {
      const exam = await ExamService.generateExamFromBank(
        req.user.userId,
        req.body
      );
      res.status(201).json({ success: true, data: exam });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  /**
   * Tạo đề thi từ essay prompt
   * POST /api/exams/generate-from-prompt
   * Body: { essayPrompt, title?, durationMinutes?, generateExplanation? }
   */
  async generateExamFromPrompt(req, res) {
    try {
      const { essayPrompt, title, durationMinutes, generateExplanation } =
        req.body;

      if (!essayPrompt) {
        return res.status(400).json({
          success: false,
          message: "essayPrompt is required",
        });
      }

      const result = await ExamService.generateExamFromEssayPrompt(
        essayPrompt,
        req.user.userId,
        { title, durationMinutes, generateExplanation }
      );

      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  /**
   * Tạo đề thi từ forum topic
   * POST /api/exams/generate-from-topic/:topicId
   * Body: { title?, durationMinutes? }
   */
  async generateExamFromTopic(req, res) {
    try {
      const { topicId } = req.params;
      const { title, durationMinutes } = req.body;

      const result = await ExamService.generateExamFromForumTopic(
        topicId,
        req.user.userId,
        { title, durationMinutes }
      );

      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  /**
   * Tạo đề thi từ nhiều forum topics
   * POST /api/exams/generate-from-multiple-topics
   * Body: { topicIds: string[], title?, durationMinutes?, generateExplanations? }
   */
  async generateExamFromMultipleTopics(req, res) {
    try {
      const { topicIds, title, durationMinutes, generateExplanations } =
        req.body;

      if (!topicIds || !Array.isArray(topicIds) || topicIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: "topicIds array is required",
        });
      }

      const result = await ExamService.generateExamFromMultipleTopics(
        topicIds,
        req.user.userId,
        { title, durationMinutes, generateExplanations }
      );

      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // NEW: Create submission (start exam)
  async createSubmission(req, res) {
    try {
      const { assignmentId, contestId } = req.body;

      console.log("🆕 Create Submission Request:", {
        examId: req.params.examId,
        userId: req.user.userId,
        assignmentId,
        contestId,
      });

      const submission = await ExamService.createSubmission(
        req.params.examId,
        req.user.userId,
        assignmentId,
        contestId
      );

      console.log("✅ Submission created:", {
        id: submission._id,
        status: submission.status,
      });

      res.status(201).json({ success: true, data: submission });
    } catch (error) {
      console.error("❌ Create submission error:", error.message);
      const statusCode = error.message.includes("not found")
        ? 404
        : error.message.includes("permission") ||
          error.message.includes("ended") ||
          error.message.includes("exceeded")
        ? 403
        : 400;
      res.status(statusCode).json({ success: false, message: error.message });
    }
  }

  // NEW: Get user's submissions for an exam
  async getMySubmissions(req, res) {
    try {
      const { assignmentId } = req.query;
      const submissions = await ExamService.getMySubmissions(
        req.params.examId,
        req.user.userId,
        assignmentId
      );
      res.status(200).json({ success: true, data: submissions });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // NEW: Process PDF and create exam with questions
  async processExamFromPdf(req, res) {
    try {
      const {
        pdfFilePath,
        pdfFileName,
        title,
        description,
        subject,
        durationMinutes,
      } = req.body;

      // If no pdfFilePath provided but we have fileName, construct it
      let filePath = pdfFilePath;
      if (!filePath && pdfFileName) {
        filePath = `/uploads/exams/${pdfFileName}`;
      }

      if (!filePath) {
        return res.status(400).json({
          success: false,
          message: "PDF file path or file name is required",
        });
      }

      const PdfProcessorService = require("../services/PdfProcessorService");
      const path = require("path");

      // Get absolute path to PDF file
      const absolutePdfPath = path.join(__dirname, "..", "..", filePath);

      // Get user to determine exam mode
      const User = require("../models/User");
      const user = await User.findById(req.user.userId);

      // Admin creates public exams (practice_global), Teacher creates class exams (practice_test)
      const examMode =
        user.role === "admin" ? "practice_global" : "practice_test";

      // Process PDF and create exam with all questions
      const result = await PdfProcessorService.processPdfAndCreateExam(
        absolutePdfPath,
        {
          title: title || "Đề thi từ PDF",
          description,
          subject: subject || "Tiếng Anh",
          durationMinutes: durationMinutes || 50,
          mode: examMode,
          shuffleQuestions: false,
          showResultsImmediately: false,
          isPublished: false,
          pdfFilePath: filePath,
          pdfFileName,
        },
        req.user.userId
      );

      res.status(201).json({
        success: true,
        data: result,
        message: "Exam created successfully from PDF",
      });
    } catch (error) {
      console.error("Error processing PDF exam:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Failed to process PDF",
      });
    }
  }
}

module.exports = new ExamController();
