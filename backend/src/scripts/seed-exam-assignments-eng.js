/**
 * Seed Script for Exam Assignments
 * 
 * This script:
 * 1. Duplicates existing exams (maintains fields, creates new IDs & timestamps)
 * 2. Ensures createdBy is a teacher (paying attention to 694672ccb8077384d256177a)
 * 3. Ensures a teacher only creates exams with the same subject
 * 4. Assigns the duplicated exams to the teacher's classes
 * 
 * Usage:
 *   node src/scripts/seed-exam-assignments.js
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Import models
const Exam = require('../models/Exam');
const ExamQuestion = require('../models/ExamQuestion');
const ExamAssignment = require('../models/ExamAssignment');
const Question = require('../models/Question');
const Class = require('../models/Class');
const User = require('../models/User');

// Configuration
const TARGET_TEACHER_ID = '694672ccb8077384d256177a';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Disconnection error:', error);
  }
};

/**
 * Helper: Generate a random alphanumeric code
 */
const generateRandomCode = (length = 6) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

/**
 * Helper: Get a random date within the next 30 days
 */
const getRandomFutureDate = (daysFromNow = 30) => {
  const start = new Date();
  const end = new Date(start.getTime() + daysFromNow * 24 * 60 * 60 * 1000);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

/**
 * Cleanup: Delete all seeded data from previous runs
 */
const cleanupSeededData = async () => {
  try {
    console.log('\n🧹 Cleaning up previously seeded data for target teacher...');
    
    // Get all exams created by target teacher
    const targetTeacherExams = await Exam.find({ createdBy: TARGET_TEACHER_ID });
    const targetExamIds = targetTeacherExams.map(e => e._id);
    
    // Delete all exam assignments for these exams
    const assignmentsResult = await ExamAssignment.deleteMany({ examId: { $in: targetExamIds } });
    console.log(`   ✅ Deleted ${assignmentsResult.deletedCount} exam assignments`);
    
    // Delete exam questions linked to these exams
    const examQuestionsResult = await ExamQuestion.deleteMany({ examId: { $in: targetExamIds } });
    console.log(`   ✅ Deleted ${examQuestionsResult.deletedCount} exam questions`);
    
    // Delete questions created by target teacher
    const questionsResult = await Question.deleteMany({ createdBy: TARGET_TEACHER_ID });
    console.log(`   ✅ Deleted ${questionsResult.deletedCount} questions`);
    
    // Delete exams created by target teacher
    const examsResult = await Exam.deleteMany({ createdBy: TARGET_TEACHER_ID });
    console.log(`   ✅ Deleted ${examsResult.deletedCount} exams`);
    
    console.log('✅ Cleanup completed!\n');
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
    throw error;
  }
};

/**
 * Main seed function
 */
const seedExamAssignments = async () => {
  try {
    // Step 0: Cleanup previously seeded data
    await cleanupSeededData();
    
    // Step 1: Find existing "Tiếng Anh" exams from other teachers
    console.log('\n📖 Fetching existing "Tiếng Anh" exams...');
    const existingExams = await Exam.find({ 
      isPublished: true,
      subject: 'Tiếng Anh',
      createdBy: { $ne: TARGET_TEACHER_ID } // Exclude exams already created by target teacher
    }).populate('createdBy', 'name role');
    
    console.log(`✅ Found ${existingExams.length} existing "Tiếng Anh" exams`);
    
    if (existingExams.length === 0) {
      console.log('⚠️  No "Tiếng Anh" exams found to duplicate');
      return;
    }
    
    // Get target teacher
    const targetTeacher = await User.findById(TARGET_TEACHER_ID);
    if (!targetTeacher) {
      console.log('❌ Target teacher not found');
      return;
    }
    
    // Get all active classes of target teacher
    const targetClasses = await Class.find({ 
      teacherUserId: TARGET_TEACHER_ID, 
      isActive: true
    });
    
    console.log(`✅ Found ${targetClasses.length} classes for ${targetTeacher.name}`);
    
    if (targetClasses.length === 0) {
      console.log('⚠️  No active classes found for target teacher');
      return;
    }
    
    // Step 2: Duplicate exams for target teacher
    console.log('\n🔄 Duplicating "Tiếng Anh" exams for target teacher...');
    let duplicatedCount = 0;
    let assignmentCount = 0;
    let duplicatedQuestions = 0;
    
    for (const originalExam of existingExams) {
      // Create duplicate exam
      const newExamData = {
        title: originalExam.title,
        description: originalExam.description,
        subject: originalExam.subject,
        durationMinutes: originalExam.durationMinutes,
        mode: originalExam.mode,
        shuffleQuestions: originalExam.shuffleQuestions,
        showResultsImmediately: originalExam.showResultsImmediately,
        createdBy: TARGET_TEACHER_ID,
        isPublished: true,
        readingPassages: originalExam.readingPassages || [],
        totalQuestions: originalExam.totalQuestions,
        totalPoints: originalExam.totalPoints,
      };

      const newExam = await Exam.create(newExamData);
      duplicatedCount++;
      console.log(`   ✅ Duplicated: "${originalExam.title}" (from ${originalExam.createdBy?.name || 'Unknown'})`);

      // Duplicate exam questions and questions
      const originalExamQuestions = await ExamQuestion.find({ examId: originalExam._id });
      if (originalExamQuestions.length > 0) {
        for (const examQuestion of originalExamQuestions) {
          const originalQuestion = await Question.findById(examQuestion.questionId);
          
          if (originalQuestion) {
            // Create a duplicate of the question
            const duplicateQuestionData = {
              content: originalQuestion.content,
              subject: originalQuestion.subject,
              level: originalQuestion.level,
              type: originalQuestion.type,
              options: originalQuestion.options,
              correctAnswers: originalQuestion.correctAnswers,
              explanation: originalQuestion.explanation,
              linkedPassageId: originalQuestion.linkedPassageId,
              image: originalQuestion.image,
              audio: originalQuestion.audio,
              maxScore: originalQuestion.maxScore,
              createdBy: TARGET_TEACHER_ID,
            };
            
            const duplicateQuestion = await Question.create(duplicateQuestionData);
            duplicatedQuestions++;
            
            // Create ExamQuestion linking the new exam to the new question
            await ExamQuestion.create({
              examId: newExam._id,
              questionId: duplicateQuestion._id,
              order: examQuestion.order,
              maxScore: examQuestion.maxScore,
              section: examQuestion.section || '',
              points: examQuestion.points,
            });
          }
        }
        console.log(`      → Duplicated ${originalExamQuestions.length} questions`);
      }

      // Assign to all classes
      for (const targetClass of targetClasses) {
        const startTime = getRandomFutureDate(30);
        const durationHours = Math.ceil(newExam.durationMinutes / 60);
        const endTime = new Date(startTime.getTime() + durationHours * 60 * 60 * 1000);
        
        await ExamAssignment.create({
          examId: newExam._id,
          classId: targetClass._id,
          startTime,
          endTime,
          shuffleQuestions: newExam.shuffleQuestions,
          allowLateSubmission: false,
          attemptLimit: 1,
        });
        
        assignmentCount++;
      }
      
      console.log(`      → Assigned to ${targetClasses.length} classes`);
    }

    console.log('\n✅ Seeding completed!');
    console.log(`   📖 Exams duplicated: ${duplicatedCount}`);
    console.log(`   📝 Questions duplicated: ${duplicatedQuestions}`);
    console.log(`   📌 Assignments created: ${assignmentCount}`);
  } catch (error) {
    console.error('❌ Error during seeding:', error.message);
    console.error(error.stack);
  } finally {
    await disconnectDB();
  }
};

// Run the seed script
connectDB().then(seedExamAssignments);
