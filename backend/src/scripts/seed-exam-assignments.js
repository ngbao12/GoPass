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
require('dotenv').config();

// Import models
const Exam = require('../models/Exam');
const ExamQuestion = require('../models/ExamQuestion');
const ExamAssignment = require('../models/ExamAssignment');
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
 * Main seed function
 */
const seedExamAssignments = async () => {
  try {
    // Step 1: Get all existing exams
    console.log('\n📖 Fetching existing exams...');
    const existingExams = await Exam.find({ isPublished: true }).populate('createdBy', 'role');
    console.log(`✅ Found ${existingExams.length} existing exams`);

    if (existingExams.length === 0) {
      console.log('⚠️  No exams to duplicate');
      return;
    }

    // Step 2: Get all teachers with classes
    console.log('\n👨‍🏫 Fetching teachers with classes...');
    const teachers = await User.find({ role: 'teacher' });
    const teachersWithClasses = await Promise.all(
      teachers.map(async (teacher) => ({
        teacher,
        classes: await Class.find({ teacherUserId: teacher._id, isActive: true }),
      }))
    );

    const teachersWithClassesFiltered = teachersWithClasses.filter(t => t.classes.length > 0);
    console.log(`✅ Found ${teachersWithClassesFiltered.length} teachers with active classes`);

    // Step 3: Highlight target teacher
    const targetTeacher = teachersWithClassesFiltered.find(
      t => t.teacher._id.toString() === TARGET_TEACHER_ID
    );
    if (targetTeacher) {
      console.log(`🎯 Target teacher found: ${targetTeacher.teacher.name} with ${targetTeacher.classes.length} classes`);
    }

    // Step 4: Group exams by subject and created teacher
    console.log('\n📚 Organizing exams by subject and teacher...');
    const examsBySubjectAndTeacher = {};
    existingExams.forEach(exam => {
      const teacherId = exam.createdBy._id.toString();
      const subject = exam.subject;
      const key = `${teacherId}|${subject}`;

      if (!examsBySubjectAndTeacher[key]) {
        examsBySubjectAndTeacher[key] = {
          teacherId,
          subject,
          exams: [],
          teacher: exam.createdBy,
        };
      }
      examsBySubjectAndTeacher[key].exams.push(exam);
    });

    console.log(`✅ Exams organized by ${Object.keys(examsBySubjectAndTeacher).length} subject-teacher combinations`);

    // Step 5: Duplicate exams and create assignments
    console.log('\n🔄 Duplicating exams and creating assignments...');
    let duplicatedCount = 0;
    let assignmentCount = 0;

    for (const key of Object.keys(examsBySubjectAndTeacher)) {
      const { teacherId, subject, exams: subjectExams, teacher } = examsBySubjectAndTeacher[key];

      // Find teachers with the same subject (for duplication)
      // Strategy: Match by exact subject, OR assign to all teachers if no match
      const exactMatchTeachers = teachersWithClassesFiltered.filter(t => {
        // Get all subjects this teacher has created exams for
        const teacherExams = existingExams.filter(
          e => e.createdBy._id.toString() === t.teacher._id.toString()
        );
        const teacherSubjects = new Set(teacherExams.map(e => e.subject));
        return teacherSubjects.has(subject);
      });

      const compatibleTeachers = exactMatchTeachers.length > 0 
        ? exactMatchTeachers 
        : teachersWithClassesFiltered; // Fallback: assign to all teachers if no exact match

      console.log(`\n📝 Subject "${subject}" (original teacher: ${teacher.name})`);
      console.log(`   Compatible teachers: ${compatibleTeachers.length}`);
      console.log(`   Exams to duplicate: ${subjectExams.length}`);

      // For each exam in this subject
      for (const originalExam of subjectExams) {
        // Duplicate for each compatible teacher (except original)
        for (const compatibleTeacher of compatibleTeachers) {
          if (compatibleTeacher.teacher._id.toString() === teacherId) {
            // Skip duplicating for the original creator
            continue;
          }

          // Create duplicate exam
          const newExamData = {
            title: `${originalExam.title} [Bản sao]`,
            description: originalExam.description,
            subject: originalExam.subject,
            durationMinutes: originalExam.durationMinutes,
            mode: originalExam.mode,
            shuffleQuestions: originalExam.shuffleQuestions,
            showResultsImmediately: originalExam.showResultsImmediately,
            createdBy: compatibleTeacher.teacher._id,
            isPublished: true,
            readingPassages: originalExam.readingPassages || [],
            totalQuestions: originalExam.totalQuestions,
            totalPoints: originalExam.totalPoints,
          };

          const newExam = await Exam.create(newExamData);
          duplicatedCount++;
          console.log(`   ✅ Duplicated: "${originalExam.title}" → ${compatibleTeacher.teacher.name}`);

          // Duplicate exam questions
          const originalQuestions = await ExamQuestion.find({ examId: originalExam._id });
          if (originalQuestions.length > 0) {
            const newQuestions = originalQuestions.map(q => ({
              examId: newExam._id,
              questionId: q.questionId,
              order: q.order,
              maxScore: q.maxScore,
              section: q.section || '',
              points: q.points,
            }));
            await ExamQuestion.insertMany(newQuestions);
          }

          // Create assignments for this duplicated exam to the compatible teacher's classes
          for (const teacherClass of compatibleTeacher.classes) {
            // Random assignment time in next 30 days
            const startTime = getRandomFutureDate(30);
            const durationHours = Math.ceil(newExam.durationMinutes / 60);
            const endTime = new Date(startTime.getTime() + durationHours * 60 * 60 * 1000);

            const assignment = await ExamAssignment.create({
              examId: newExam._id,
              classId: teacherClass._id,
              startTime,
              endTime,
              shuffleQuestions: newExam.shuffleQuestions,
              allowLateSubmission: false,
              attemptLimit: 1,
            });

            assignmentCount++;
          }

          console.log(
            `   📌 Assigned to ${compatibleTeacher.classes.length} classes of ${compatibleTeacher.teacher.name}`
          );
        }
      }
    }

    console.log('\n✅ Seeding completed!');
    console.log(`   📖 Exams duplicated: ${duplicatedCount}`);
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
