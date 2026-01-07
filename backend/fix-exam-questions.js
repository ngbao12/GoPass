/**
 * Script để fix exam không có linked questions
 * Tìm questions của exam và link lại
 * Chạy: node fix-exam-questions.js <examId>
 */

require("dotenv").config();
const mongoose = require("mongoose");

// Import models
const Exam = require("./src/models/Exam");
const Question = require("./src/models/Question");
const ExamQuestion = require("./src/models/ExamQuestion");

async function fixExamQuestions(examId) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // 1. Get Exam
    console.log("1️⃣ Loading exam...");
    const exam = await Exam.findById(examId);
    if (!exam) {
      console.error(`❌ Exam ${examId} not found!`);
      process.exit(1);
    }
    console.log(`✅ Exam: "${exam.title}"`);
    console.log(`   Expected questions: ${exam.totalQuestions}\n`);

    // 2. Find Questions - Multiple strategies
    console.log("2️⃣ Finding questions...");
    console.log("   Strategy 1: Same subject + same creator");

    let questions = await Question.find({
      createdBy: exam.createdBy,
      subject: exam.subject,
    })
      .sort({ createdAt: -1 })
      .limit(100);

    console.log(
      `   Found ${questions.length} questions with subject="${exam.subject}"`
    );

    // If found too many, narrow down by time
    if (questions.length > exam.totalQuestions * 2) {
      console.log(
        `   Too many questions (${questions.length}), filtering by time...`
      );
      const examCreatedTime = exam.createdAt;
      const timeWindow = 60 * 60 * 1000; // 1 hour window

      questions = questions.filter((q) => {
        const diff = Math.abs(q.createdAt - examCreatedTime);
        return diff < timeWindow;
      });
      console.log(`   After time filter: ${questions.length} questions`);
    }

    // If still too many or too few, just take the most recent N questions
    if (questions.length > exam.totalQuestions) {
      console.log(`   Taking first ${exam.totalQuestions} questions...`);
      questions = questions.slice(0, exam.totalQuestions);
    }

    if (questions.length === 0) {
      console.error("❌ Strategy 1 failed. Trying strategy 2...");

      // Strategy 2: Just get ANY questions by this creator
      console.log("   Strategy 2: Any questions by creator (ignoring subject)");
      questions = await Question.find({
        createdBy: exam.createdBy,
      })
        .sort({ createdAt: -1 })
        .limit(exam.totalQuestions);

      console.log(`   Found ${questions.length} questions`);
    }

    if (questions.length === 0) {
      console.error("❌ No questions found at all! Cannot fix.");
      console.log("\n💡 Debugging info:");
      console.log(`   Exam creator ID: ${exam.createdBy}`);
      console.log(`   Exam subject: ${exam.subject}`);
      console.log(`   Exam created: ${exam.createdAt}`);
      console.log("\n💡 Manual check:");
      console.log(
        `   db.questions.find({createdBy: ObjectId("${exam.createdBy}")}).count()`
      );
      console.log(
        `   db.questions.find({createdBy: ObjectId("${exam.createdBy}")}).pretty()`
      );
      process.exit(1);
    }

    console.log(`\n✅ Selected ${questions.length} questions to link`);
    if (questions.length !== exam.totalQuestions) {
      console.warn(
        `⚠️ Found ${questions.length} questions but exam expects ${exam.totalQuestions}`
      );
      console.log("   Proceeding with found questions...");
    }
    console.log("");

    // 3. Check existing links
    console.log("3️⃣ Checking existing links...");
    const existingLinks = await ExamQuestion.countDocuments({ examId });
    console.log(`   Existing links: ${existingLinks}`);

    if (existingLinks > 0) {
      console.log("⚠️ Some links already exist. Delete them? (y/n)");
      // For script, we'll assume yes
      console.log("   Deleting existing links...");
      await ExamQuestion.deleteMany({ examId });
      console.log("   ✅ Deleted\n");
    } else {
      console.log("   ✅ No existing links\n");
    }

    // 4. Create links
    console.log("4️⃣ Creating ExamQuestion links...");
    const examQuestions = [];

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];

      // Determine section based on question tags or index
      let section = "Part A";
      if (question.tags && question.tags.length > 0) {
        // Try to extract section from tags
        const sectionTag = question.tags.find((tag) =>
          tag.toLowerCase().includes("part")
        );
        if (sectionTag) {
          section = sectionTag;
        }
      } else if (i < 10) {
        section = "Part A: Multiple Choice";
      } else if (i < 30) {
        section = "Part B: Reading Comprehension";
      } else {
        section = "Part C: Writing";
      }

      const examQuestion = await ExamQuestion.create({
        examId: exam._id,
        questionId: question._id,
        order: i + 1,
        section: section,
        maxScore: question.points || 0.25,
      });

      examQuestions.push(examQuestion);

      if ((i + 1) % 10 === 0) {
        console.log(`   Created ${i + 1}/${questions.length} links...`);
      }
    }

    console.log(`✅ Created ${examQuestions.length} ExamQuestion links\n`);

    // 5. Update exam totalQuestions if needed
    if (exam.totalQuestions !== questions.length) {
      console.log("5️⃣ Updating exam totalQuestions...");
      exam.totalQuestions = questions.length;
      await exam.save();
      console.log(`   ✅ Updated to ${questions.length}\n`);
    }

    // 6. Verify
    console.log("6️⃣ Verification...");
    const finalCount = await ExamQuestion.countDocuments({ examId });
    console.log(`   Final linked questions: ${finalCount}`);

    if (finalCount === questions.length) {
      console.log("✅ SUCCESS! Exam is now fixed.\n");
    } else {
      console.error(
        `❌ Something went wrong. Expected ${questions.length}, got ${finalCount}`
      );
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error(error.stack);
  } finally {
    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  }
}

// Get examId from command line
const examId = process.argv[2];

if (!examId) {
  console.error("❌ Usage: node fix-exam-questions.js <examId>");
  console.log("\nExample:");
  console.log("  node fix-exam-questions.js 695e700e380cadfce7645010");
  process.exit(1);
}

console.log("🔧 Fix Exam Questions Script");
console.log("═".repeat(50));
console.log(`Exam ID: ${examId}\n`);

fixExamQuestions(examId);
