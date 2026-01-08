const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs").promises;

class PdfProcessorService {
  /**
   * Process PDF file and extract exam data using Python script
   * @param {string} pdfFilePath - Absolute path to PDF file
   * @param {string} userId - ID of the user creating the exam
   * @returns {Promise<Object>} Processed exam data with passages and questions
   */
  static async processPdfToExam(pdfFilePath, userId) {
    return new Promise((resolve, reject) => {
      const pythonScript = path.join(
        __dirname,
        "..",
        "folder_process_api",
        "convert_pdf_final.py"
      );

      // Check if Python script exists
      fs.access(pythonScript)
        .then(() => {
          console.log("🐍 Starting Python PDF processor...");
          console.log("📄 PDF Path:", pdfFilePath);
          console.log("📜 Script Path:", pythonScript);

          // Spawn Python process with UTF-8 encoding
          const pythonProcess = spawn("python", [pythonScript, pdfFilePath], {
            env: {
              ...process.env,
              PYTHONIOENCODING: "utf-8", // Force UTF-8 encoding
            },
          });

          let stdoutData = "";
          let stderrData = "";

          pythonProcess.stdout.on("data", (data) => {
            const chunk = data.toString("utf8");
            stdoutData += chunk;
          });

          pythonProcess.stderr.on("data", (data) => {
            const chunk = data.toString("utf8");
            stderrData += chunk;
            // Log stderr for debugging but don't fail immediately
            console.warn("Python stderr:", chunk);
          });

          pythonProcess.on("close", (code) => {
            console.log(`Python process exited with code ${code}`);

            if (code !== 0) {
              console.error("❌ Python process error:", stderrData);
              reject(
                new Error(
                  `PDF processing failed with code ${code}: ${
                    stderrData || "Unknown error"
                  }`
                )
              );
              return;
            }

            try {
              // Python script outputs JSON to stdout
              console.log("📦 Parsing JSON output...");
              const examData = JSON.parse(stdoutData);
              console.log(
                `✅ Parsed ${examData.passages?.length || 0} passages, ${
                  examData.questions?.length || 0
                } questions`
              );

              // Transform data to include userId and proper structure
              const transformedData = this.transformExamData(examData, userId);

              resolve(transformedData);
            } catch (error) {
              console.error("❌ JSON parse error:", error.message);
              console.error("Raw stdout:", stdoutData.substring(0, 200));
              reject(new Error(`Failed to parse exam data: ${error.message}`));
            }
          });

          pythonProcess.on("error", (error) => {
            console.error("❌ Failed to start Python:", error);
            reject(
              new Error(`Failed to start Python process: ${error.message}`)
            );
          });
        })
        .catch((error) => {
          console.error("❌ Python script not found:", pythonScript);
          reject(new Error(`Python script not found: ${pythonScript}`));
        });
    });
  }

  /**
   * Transform Python output to GoPass database format
   * @param {Object} examData - Raw data from Python script
   * @param {string} userId - User ID for createdBy field
   * @returns {Object} Transformed exam data
   */
  static transformExamData(examData, userId) {
    const { passages = [], questions = [] } = examData;

    // Transform passages
    const readingPassages = passages.map((passage, index) => ({
      id: passage.passage_id || `passage-${index + 1}`,
      title: passage.instruction || "",
      content: passage.content || "",
    }));

    // Transform questions with proper createdBy
    const transformedQuestions = questions.map((question) => {
      const tags = question.tags || [];

      return {
        type: "multiple_choice",
        content: question.question_text || question.question || "",
        options: this.transformOptions(question.options, question.answer),
        correctAnswer: question.answer || "",
        explanation: question.explanation || "",
        difficulty: "medium",
        linkedPassageId: question.PassageRelated || null,
        subject: "Tiếng Anh",
        points: 0.25,
        isPublic: true,
        createdBy: userId, // Use actual user ID from request
        tags: tags,
      };
    });

    // Determine sections for ExamQuestion relationships
    const examQuestions = questions.map((question, index) => {
      const tags = question.tags || [];
      const order = index + 1;
      let section = "Sentence/Utterance Arrangement"; // Default for empty tags

      // FIXED LOGIC: Use tags only
      // - Empty tags = "Sentence/Utterance Arrangement"
      // - tag "cloze" = "Cloze Test"
      // - tag "reading" = "Reading Comprehension"
      if (tags.includes("cloze")) {
        section = "Cloze Test";
      } else if (tags.includes("reading") || question.PassageRelated) {
        section = "Reading Comprehension";
      }
      // else: keep default "Sentence/Utterance Arrangement"

      return {
        questionId: null, // Will be set after question is created
        order: order,
        section: section,
        maxScore: 0.25,
      };
    });

    return {
      readingPassages,
      questions: transformedQuestions,
      examQuestions,
      stats: {
        totalQuestions: questions.length,
        totalPassages: passages.length,
        totalPoints: questions.length * 0.25,
        clozeQuestions: questions.filter((q) =>
          (q.tags || []).includes("cloze")
        ).length,
        readingQuestions: questions.filter((q) =>
          (q.tags || []).includes("reading")
        ).length,
      },
    };
  }

  /**
   * Transform question options
   * @param {Object|Array} options - Question options
   * @param {string} correctAnswer - Correct answer key
   * @returns {Array} Transformed options
   */
  static transformOptions(options, correctAnswer) {
    const result = [];

    if (typeof options === "object" && !Array.isArray(options)) {
      // Options are in format: {"A": "text", "B": "text", ...}
      for (const [key, text] of Object.entries(options)) {
        // Skip if text is empty, null, or undefined
        if (text && text.trim()) {
          result.push({
            id: key,
            content: text.trim(),
            isCorrect: key === correctAnswer,
          });
        }
      }
    } else if (Array.isArray(options)) {
      // Options are in format: [{"key": "A", "text": "..."}, ...]
      for (const opt of options) {
        const content = opt.text || opt.content || "";
        // Skip if content is empty, null, or undefined
        if (content && content.trim()) {
          result.push({
            id: opt.key || opt.id || "",
            content: content.trim(),
            isCorrect: (opt.key || opt.id) === correctAnswer,
          });
        }
      }
    }

    // Ensure we have at least one option, otherwise throw error
    if (result.length === 0) {
      throw new Error(
        "Question must have at least one valid option with content"
      );
    }

    return result;
  }

  /**
   * Process PDF and create complete exam with questions in database
   * @param {string} pdfFilePath - Path to PDF file
   * @param {Object} examMetadata - Exam title, description, etc.
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Created exam with all questions
   */
  static async processPdfAndCreateExam(pdfFilePath, examMetadata, userId) {
    // First, process the PDF
    const processedData = await this.processPdfToExam(pdfFilePath, userId);

    // Import required services (avoid circular dependency)
    const ExamService = require("./ExamService");
    const QuestionRepository = require("../repositories/QuestionRepository");

    // Create the exam first
    const examData = {
      title: examMetadata.title,
      description: examMetadata.description || "Đề thi được tạo từ file PDF",
      subject: examMetadata.subject || "Tiếng Anh",
      durationMinutes: examMetadata.durationMinutes || 50,
      mode: examMetadata.mode || "practice_test",
      shuffleQuestions: examMetadata.shuffleQuestions || false,
      showResultsImmediately: examMetadata.showResultsImmediately || false,
      isPublished: examMetadata.isPublished || false,
      readingPassages: processedData.readingPassages,
      totalQuestions: processedData.questions.length,
      totalPoints: processedData.stats.totalPoints,
      pdfFilePath: examMetadata.pdfFilePath,
      pdfFileName: examMetadata.pdfFileName,
    };

    const createdExam = await ExamService.createExam(userId, examData);

    // Create all questions
    const createdQuestions = [];
    for (const questionData of processedData.questions) {
      const question = await QuestionRepository.create(questionData);
      createdQuestions.push(question);
    }

    // Link questions to exam
    const examQuestionsToAdd = createdQuestions.map((question, index) => {
      const examQuestionData = processedData.examQuestions[index];
      return {
        questionId: question._id.toString(),
        order: examQuestionData.order,
        section: examQuestionData.section,
        maxScore: examQuestionData.maxScore,
      };
    });

    await ExamService.addQuestions(
      createdExam._id.toString(),
      userId,
      examQuestionsToAdd
    );

    return {
      exam: createdExam,
      questions: createdQuestions,
      stats: processedData.stats,
    };
  }
}

module.exports = PdfProcessorService;
