# Exam Creation Database Flow

## Overview

Khi teacher tạo đề thi từ PDF thông qua `processPdfToExam`, hệ thống sẽ tạo và lưu các documents sau vào MongoDB:

## 1. Exam Document

**Collection:** `exams`

**Mục đích:** Document chính đại diện cho đề thi

### Các trường được lưu:

```javascript
{
  _id: ObjectId("..."),                    // Auto-generated
  title: "Đề thi Tiếng Anh Học kì I",      // Từ form metadata
  description: "Đề thi được tạo từ file PDF", // Default hoặc từ form
  subject: "Tiếng Anh",                    // Từ form metadata
  durationMinutes: 50,                     // Từ form metadata
  mode: "practice_test",                   // Default: practice_test
  shuffleQuestions: false,                 // Từ form metadata
  showResultsImmediately: false,           // Từ form metadata
  isPublished: false,                      // Từ form metadata
  createdBy: ObjectId("teacher_user_id"),  // Teacher's user ID

  // Reading passages được extract từ PDF
  readingPassages: [
    {
      id: "passage_1",                     // Custom ID để link với questions
      title: "Reading Passage 1",
      content: "<p>Full HTML content of the reading passage...</p>"
    },
    {
      id: "passage_2",
      title: "Reading Passage 2",
      content: "<p>Another reading passage content...</p>"
    }
  ],

  // Stats được tính từ questions
  totalQuestions: 40,                      // Tổng số câu hỏi
  totalPoints: 10,                         // Tổng điểm (default)

  // PDF metadata
  pdfFilePath: "/uploads/exams/exam123.pdf",
  pdfFileName: "de-thi-tieng-anh.pdf",

  createdAt: ISODate("2024-01-15T10:30:00Z"),
  updatedAt: ISODate("2024-01-15T10:30:00Z")
}
```

## 2. Question Documents

**Collection:** `questions`

**Mục đích:** Lưu trữ từng câu hỏi trong đề thi (question bank)

Python script sẽ extract các câu hỏi từ PDF và tạo document cho mỗi câu:

### Multiple Choice Question Example:

```javascript
{
  _id: ObjectId("..."),
  type: "multiple_choice",
  content: "What is the main idea of the passage?",

  options: [
    {
      key: "A",
      text: "The importance of education",
      isCorrect: true
    },
    {
      key: "B",
      text: "The history of schools",
      isCorrect: false
    },
    {
      key: "C",
      text: "Modern teaching methods",
      isCorrect: false
    },
    {
      key: "D",
      text: "Student behavior",
      isCorrect: false
    }
  ],

  correctAnswer: "A",
  explanation: "The passage focuses on education's role in society.",

  // Link to reading passage (nếu có)
  linkedPassageId: "passage_1",

  // Question metadata
  difficulty: "medium",
  subject: "Tiếng Anh",
  tags: ["reading_comprehension", "main_idea"],
  points: 0.25,

  createdBy: ObjectId("teacher_user_id"),
  isPublic: false,

  createdAt: ISODate("2024-01-15T10:30:00Z"),
  updatedAt: ISODate("2024-01-15T10:30:00Z")
}
```

### Short Answer Question Example:

```javascript
{
  _id: ObjectId("..."),
  type: "short_answer",
  content: "Write the correct form of the verb in brackets.",

  correctAnswer: "have been studying",
  explanation: "Present perfect continuous tense is used here.",

  difficulty: "medium",
  subject: "Tiếng Anh",
  tags: ["grammar", "verb_tense"],
  points: 0.25,

  createdBy: ObjectId("teacher_user_id"),
  isPublic: false,

  createdAt: ISODate("2024-01-15T10:30:00Z"),
  updatedAt: ISODate("2024-01-15T10:30:00Z")
}
```

### Essay Question Example:

```javascript
{
  _id: ObjectId("..."),
  type: "essay",
  content: "Write a paragraph (80-100 words) about your favorite hobby.",

  explanation: "Students should include: introduction, details, and conclusion.",

  difficulty: "hard",
  subject: "Tiếng Anh",
  tags: ["writing", "essay"],
  points: 2,

  createdBy: ObjectId("teacher_user_id"),
  isPublic: false,

  createdAt: ISODate("2024-01-15T10:30:00Z"),
  updatedAt: ISODate("2024-01-15T10:30:00Z")
}
```

## 3. ExamQuestion Links

**Collection:** `examquestions`

**Mục đích:** Liên kết giữa Exam và Questions (many-to-many relationship)

Sau khi tạo Exam và Questions, hệ thống tạo các link documents:

```javascript
{
  _id: ObjectId("..."),
  examId: ObjectId("exam_id"),
  questionId: ObjectId("question_id"),

  // Thứ tự câu hỏi trong đề
  order: 1,

  // Section/Part của câu hỏi
  section: "Part A: Reading Comprehension",

  // Điểm cho câu này trong đề thi cụ thể
  maxScore: 0.25,

  createdAt: ISODate("2024-01-15T10:30:00Z"),
  updatedAt: ISODate("2024-01-15T10:30:00Z")
}
```

Mỗi câu hỏi sẽ có 1 ExamQuestion document tương ứng để:

- Xác định thứ tự (order: 1, 2, 3...)
- Gán section (Part A, Part B...)
- Đặt điểm riêng cho câu đó trong đề này

## Database Flow Diagram

```
Teacher uploads PDF + metadata
         ↓
Python script processes PDF
         ↓
    ┌────────────────────────────┐
    │  Extract exam structure    │
    │  - Reading passages        │
    │  - Questions               │
    │  - Answer keys            │
    └────────────────────────────┘
         ↓
    ┌────────────────────────────┐
    │  Create Exam document      │
    │  - Save to exams collection│
    │  - Include readingPassages │
    │  - Save metadata          │
    └────────────────────────────┘
         ↓
    ┌────────────────────────────┐
    │  Create Question documents │
    │  - Loop through questions  │
    │  - Save each to questions  │
    │  - Store question IDs      │
    └────────────────────────────┘
         ↓
    ┌────────────────────────────┐
    │  Create ExamQuestion links │
    │  - Link examId + questionId│
    │  - Set order and section   │
    │  - Assign maxScore         │
    └────────────────────────────┘
         ↓
    Return complete exam object
```

## Summary

**3 Collections được cập nhật:**

1. **`exams`**: 1 document mới cho đề thi
2. **`questions`**: N documents (N = số câu hỏi trong đề)
3. **`examquestions`**: N documents linking exam ↔ questions

**Tổng số documents tạo:** 1 + 2N

Ví dụ: Đề thi có 40 câu hỏi → Tạo 81 documents:

- 1 Exam
- 40 Questions
- 40 ExamQuestions

## Code Reference

Backend service: `backend/src/services/PdfProcessorService.js`

```javascript
static async processPdfAndCreateExam(pdfFilePath, examMetadata, userId) {
  // 1. Process PDF
  const processedData = await this.processPdfToExam(pdfFilePath, userId);

  // 2. Create Exam document
  const createdExam = await ExamService.createExam(userId, examData);

  // 3. Create Question documents
  const createdQuestions = [];
  for (const questionData of processedData.questions) {
    const question = await QuestionRepository.create(questionData);
    createdQuestions.push(question);
  }

  // 4. Create ExamQuestion links
  await ExamService.addQuestions(
    createdExam._id.toString(),
    userId,
    examQuestionsToAdd
  );

  return { exam, questions, stats };
}
```

## Notes

- **Reading Passages** được lưu trực tiếp trong Exam document (embedded), không tạo collection riêng
- **Questions** có thể được reuse cho nhiều exams khác thông qua ExamQuestion links
- **Question types** supported: `multiple_choice`, `short_answer`, `essay`, `true_false`
- Hệ thống tự động tính `totalQuestions` và `totalPoints` từ các questions được link
