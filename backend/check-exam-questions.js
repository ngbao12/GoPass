/**
 * Script để check exam và questions trong database
 * Chạy: node check-exam-questions.js <examId>
 */

require("dotenv").config();
const mongoose = require("mongoose");

// Import models
const Exam = require("./src/models/Exam");
const Question = require("./src/models/Question");
const ExamQuestion = require("./src/models/ExamQuestion");

async function checkExamQuestions(examId) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // 1. Check Exam exists
    console.log("1️⃣ Checking Exam...");
    const exam = await Exam.findById(examId);
    if (!exam) {
      console.error(`❌ Exam ${examId} not found!`);
      process.exit(1);
    }
    console.log(`✅ Exam found: "${exam.title}"`);
    console.log(`   - Subject: ${exam.subject}`);
    console.log(`   - Duration: ${exam.durationMinutes} minutes`);
    console.log(`   - Total Questions (cached): ${exam.totalQuestions}`);
    console.log(`   - Total Points: ${exam.totalPoints}`);
    console.log(`   - Reading Passages: ${exam.readingPassages?.length || 0}`);
    console.log("");

    // 2. Check Questions in Question collection
    console.log("2️⃣ Checking Questions collection...");
    const allQuestions = await Question.find({
      createdBy: exam.createdBy,
    }).countDocuments();
    console.log(`   Total questions by creator: ${allQuestions}`);
    console.log("");

    // 3. Check ExamQuestion links
    console.log("3️⃣ Checking ExamQuestion links...");
    const examQuestions = await ExamQuestion.find({ examId })
      .populate("questionId")
      .sort({ order: 1 });

    console.log(`   Linked questions: ${examQuestions.length}`);

    if (examQuestions.length === 0) {
      console.error("❌ NO QUESTIONS LINKED TO THIS EXAM!");
      console.log("\n🔍 Possible causes:");
      console.log("   1. Exam was created but processPdfToExam failed");
      console.log("   2. Questions exist but not linked via ExamQuestion");
      console.log("   3. ExamQuestion documents were deleted");

      console.log("\n🔧 Solutions:");
      console.log("   1. Re-run processPdfToExam for this exam");
      console.log("   2. Check if Questions exist:");
      console.log(
        `      db.questions.find({createdBy: ObjectId("${exam.createdBy}")})`
      );
      console.log(
        "   3. Manually link questions via ExamService.addQuestions()"
      );
    } else {
      console.log("\n📋 Question details:");
      examQuestions.forEach((eq, index) => {
        const q = eq.questionId;
        if (!q) {
          console.log(
            `   ${index + 1}. ❌ Question not found (ID: ${eq.questionId})`
          );
        } else {
          console.log(
            `   ${index + 1}. Order ${eq.order}: ${
              q.type
            } - "${q.content.substring(0, 50)}..."`
          );
        }
      });
    }
    console.log("");

    // 4. Summary
    console.log("📊 Summary:");
    console.log(`   Exam totalQuestions field: ${exam.totalQuestions}`);
    console.log(`   Actual linked questions: ${examQuestions.length}`);

    if (exam.totalQuestions !== examQuestions.length) {
      console.warn(
        `   ⚠️ MISMATCH! Exam says ${exam.totalQuestions} but only ${examQuestions.length} linked`
      );
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error(error.stack);
  } finally {
    await mongoose.disconnect();
    console.log("\n✅ Disconnected from MongoDB");
  }
}

// Get examId from command line
const examId = process.argv[2];

if (!examId) {
  console.error("❌ Usage: node check-exam-questions.js <examId>");
  console.log("\nExample:");
  console.log("  node check-exam-questions.js 695e700e380cadfce7645010");
  process.exit(1);
}

checkExamQuestions(examId);
