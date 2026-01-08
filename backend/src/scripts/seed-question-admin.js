/**
 * Seed Script for Admin Questions
 * 
 * This script:
 * 1. Duplicates existing questions and assigns them to admin
 * 2. For Tiếng Anh: only multiple choice, 5 questions per difficulty
 * 3. For Toán: 5 questions per difficulty (any type)
 * 
 * Usage:
 *   node src/scripts/seed-question-admin.js
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Import models
const Question = require('../models/Question');
const User = require('../models/User');

// Configuration
const ADMIN_ID = '694672ccb8077384d256177c';
const QUESTIONS_PER_DIFFICULTY = 5;
const SUBJECTS = {
  ENGLISH: 'Tiếng Anh',
  MATH: 'Toán Học'
};
const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'];

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
 * Main seed function for questions
 */
const seedQuestionsForAdmin = async () => {
  try {
    console.log('\n🌱 Starting question seeding for admin...\n');
    
    // Verify admin exists
    const admin = await User.findById(ADMIN_ID);
    if (!admin) {
      console.log('❌ Admin not found');
      return;
    }
    console.log(`✅ Admin found: ${admin.name || admin.email}`);
    
    let totalSeeded = 0;
    
    // Seed Toán học questions (any type)
    console.log('\n📗 Seeding Toán học questions (all types)...');
    for (const difficulty of DIFFICULTY_LEVELS) {
      const existingQuestions = await Question.find({
        subject: SUBJECTS.MATH,
        difficulty: difficulty,
        createdBy: { $ne: ADMIN_ID }
      }).limit(QUESTIONS_PER_DIFFICULTY);
      
      console.log(`   Finding ${difficulty} questions: Found ${existingQuestions.length}`);
      
      for (const question of existingQuestions) {
        const newQuestionData = {
          content: question.content,
          subject: question.subject,
          difficulty: question.difficulty,
          type: question.type,
          options: question.options,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
          linkedPassageId: question.linkedPassageId,
          image: question.image,
          tableData: question.tableData,
          tags: question.tags,
          points: question.points || 1,
          createdBy: ADMIN_ID,
          isPublic: question.isPublic || false,
        };
        
        await Question.create(newQuestionData);
        totalSeeded++;
      }
      
      console.log(`   ✅ Seeded ${existingQuestions.length} ${difficulty} questions`);
    }
    
    console.log('\n✅ Question seeding completed!');
    console.log(`   📝 Total questions seeded: ${totalSeeded}`);
    console.log(`   👤 Assigned to admin: ${admin.name || admin.email}`);
  } catch (error) {
    console.error('❌ Error during seeding:', error.message);
    console.error(error.stack);
  } finally {
    await disconnectDB();
  }
};

// Run the seed script
connectDB().then(seedQuestionsForAdmin);
