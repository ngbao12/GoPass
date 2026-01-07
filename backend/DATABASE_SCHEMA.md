# Database Schema Documentation

## Overview

This document describes all database tables (collections), their attributes, data types, and relationships in the GoPass application backend. The schema is based on MongoDB using Mongoose ODM.

---

## Table of Contents

### Core System

1. [User](#user)
2. [Class](#class)
3. [ClassMember](#classmember)
4. [ClassJoinRequest](#classjoinrequest)

### Exam & Question System

5. [Exam](#exam)
6. [Question](#question)
7. [ExamQuestion](#examquestion)
8. [ExamAssignment](#examassignment)
9. [ExamSubmission](#examsubmission)
10. [ExamAnswer](#examanswer)
11. [ManualGrading](#manualgrading)

### Contest System

12. [Contest](#contest)
13. [ContestExam](#contestexam)
14. [ContestParticipation](#contestparticipation)

### Forum System

15. [ForumPackage](#forumpackage)
16. [ForumTopic](#forumtopic)
17. [ForumComment](#forumcomment)

### VnSocial Integration

18. [VnsocialTopic](#vnsocialtopic)
19. [VnsocialArticle](#vnsocialarticle)
20. [UsedArticle](#usedarticle)

---

## 1. User

**Collection Name:** `users`

**Description:** Stores information about users in the system (students, teachers, and admins).

### Attributes

| Field          | Type     | Required | Default      | Description                                            |
| -------------- | -------- | -------- | ------------ | ------------------------------------------------------ |
| `_id`          | ObjectId | Yes      | Auto         | Primary key                                            |
| `name`         | String   | Yes      | -            | User's full name (trimmed)                             |
| `email`        | String   | Yes      | -            | User's email (unique, lowercase, trimmed)              |
| `role`         | String   | Yes      | `'student'`  | User role: `'student'`, `'teacher'`, or `'admin'`      |
| `status`       | String   | Yes      | `'active'`   | Account status: `'active'`, `'locked'`, or `'pending'` |
| `passwordHash` | String   | Yes      | -            | Hashed password                                        |
| `avatar`       | String   | No       | -            | URL to user's avatar image                             |
| `phone`        | String   | No       | -            | User's phone number                                    |
| `createdAt`    | Date     | Yes      | `Date.now()` | Timestamp of creation                                  |
| `updatedAt`    | Date     | Yes      | `Date.now()` | Timestamp of last update                               |

### Indexes

- `email` (unique)
- `role`, `status` (compound)

### Relationships

- **One-to-Many** with `Class` (as teacher)
- **One-to-Many** with `ClassMember` (as student)
- **One-to-Many** with `Exam` (as creator)
- **One-to-Many** with `Question` (as creator)
- **One-to-Many** with `Contest` (as owner)

---

## 2. Class

**Collection Name:** `classes`

**Description:** Represents a class or course in the system.

### Attributes

| Field             | Type     | Required | Default | Description                       |
| ----------------- | -------- | -------- | ------- | --------------------------------- |
| `_id`             | ObjectId | Yes      | Auto    | Primary key                       |
| `className`       | String   | Yes      | -       | Class name (trimmed)              |
| `classCode`       | String   | Yes      | -       | Unique class code (uppercase)     |
| `teacherUserId`   | ObjectId | Yes      | -       | Reference to User (teacher)       |
| `description`     | String   | No       | -       | Class description (trimmed)       |
| `requireApproval` | Boolean  | Yes      | `true`  | Whether joining requires approval |
| `isActive`        | Boolean  | Yes      | `true`  | Whether the class is active       |
| `createdAt`       | Date     | Yes      | Auto    | Timestamp of creation             |
| `updatedAt`       | Date     | Yes      | Auto    | Timestamp of last update          |

### Indexes

- `classCode` (unique)
- `teacherUserId`

### Relationships

- **Many-to-One** with `User` (teacher)
- **One-to-Many** with `ClassMember`
- **One-to-Many** with `ClassJoinRequest`
- **One-to-Many** with `ExamAssignment`

---

## 3. ClassMember

**Collection Name:** `classmembers`

**Description:** Junction table linking students to classes.

### Attributes

| Field           | Type     | Required | Default      | Description                                  |
| --------------- | -------- | -------- | ------------ | -------------------------------------------- |
| `_id`           | ObjectId | Yes      | Auto         | Primary key                                  |
| `classId`       | ObjectId | Yes      | -            | Reference to Class                           |
| `studentUserId` | ObjectId | Yes      | -            | Reference to User (student)                  |
| `status`        | String   | Yes      | `'active'`   | Membership status: `'active'` or `'removed'` |
| `joinedDate`    | Date     | Yes      | `Date.now()` | Timestamp when student joined                |
| `createdAt`     | Date     | Yes      | Auto         | Timestamp of creation                        |
| `updatedAt`     | Date     | Yes      | Auto         | Timestamp of last update                     |

### Indexes

- `classId`, `studentUserId` (compound, unique)
- `studentUserId`

### Relationships

- **Many-to-One** with `Class`
- **Many-to-One** with `User` (student)

---

## 4. ClassJoinRequest

**Collection Name:** `classjoinrequests`

**Description:** Stores requests from students to join classes that require approval.

### Attributes

| Field           | Type     | Required | Default      | Description                                                |
| --------------- | -------- | -------- | ------------ | ---------------------------------------------------------- |
| `_id`           | ObjectId | Yes      | Auto         | Primary key                                                |
| `classId`       | ObjectId | Yes      | -            | Reference to Class                                         |
| `studentUserId` | ObjectId | Yes      | -            | Reference to User (student)                                |
| `status`        | String   | Yes      | `'pending'`  | Request status: `'pending'`, `'approved'`, or `'rejected'` |
| `requestedAt`   | Date     | Yes      | `Date.now()` | Timestamp of request                                       |
| `processedAt`   | Date     | No       | -            | Timestamp when request was processed                       |
| `processedBy`   | ObjectId | No       | -            | Reference to User who processed the request                |
| `createdAt`     | Date     | Yes      | Auto         | Timestamp of creation                                      |
| `updatedAt`     | Date     | Yes      | Auto         | Timestamp of last update                                   |

### Indexes

- `classId`, `status` (compound)
- `studentUserId`

### Relationships

- **Many-to-One** with `Class`
- **Many-to-One** with `User` (student)
- **Many-to-One** with `User` (processor)

---

## 5. Exam

**Collection Name:** `exams`

**Description:** Stores exam/test templates with embedded reading passages.

### Attributes

| Field                    | Type                  | Required | Default           | Description                                                    |
| ------------------------ | --------------------- | -------- | ----------------- | -------------------------------------------------------------- |
| `_id`                    | ObjectId              | Yes      | Auto              | Primary key                                                    |
| `title`                  | String                | Yes      | -                 | Exam title (trimmed)                                           |
| `description`            | String                | No       | -                 | Exam description                                               |
| `subject`                | String                | Yes      | -                 | Subject/topic of the exam                                      |
| `durationMinutes`        | Number                | Yes      | `60`              | Exam duration in minutes                                       |
| `mode`                   | String                | Yes      | `'practice_test'` | Exam mode: `'practice_test'`, `'practice_global'`, `'contest'` |
| `shuffleQuestions`       | Boolean               | Yes      | `false`           | Whether to shuffle question order                              |
| `showResultsImmediately` | Boolean               | Yes      | `false`           | Whether to show results after submission                       |
| `createdBy`              | ObjectId              | Yes      | -                 | Reference to User (creator)                                    |
| `isPublished`            | Boolean               | Yes      | `true`            | Whether the exam is published                                  |
| `readingPassages`        | Array[ReadingPassage] | No       | `[]`              | Array of embedded reading passages                             |
| `totalQuestions`         | Number                | No       | `0`               | Cached count of questions                                      |
| `totalPoints`            | Number                | No       | `10`              | Total points for the exam                                      |
| `createdAt`              | Date                  | Yes      | `Date.now()`      | Timestamp of creation                                          |
| `updatedAt`              | Date                  | Yes      | `Date.now()`      | Timestamp of last update                                       |

### ReadingPassage Sub-schema

| Field     | Type   | Required | Description                               |
| --------- | ------ | -------- | ----------------------------------------- |
| `id`      | String | Yes      | Custom ID (e.g., "passage_1") for linking |
| `title`   | String | Yes      | Title of the reading passage              |
| `content` | String | Yes      | HTML content of the reading passage       |

**Note:** ReadingPassage does not have `_id` field (disabled for easier mapping).

### Indexes

- `createdBy`
- `subject`

### Relationships

- **Many-to-One** with `User` (creator)
- **One-to-Many** with `ExamQuestion`
- **One-to-Many** with `ExamAssignment`
- **One-to-Many** with `ExamSubmission`

---

## 6. Question

**Collection Name:** `questions`

**Description:** Question bank storing individual questions with various types and formats.

### Attributes

| Field               | Type                  | Required | Default    | Description                                                                        |
| ------------------- | --------------------- | -------- | ---------- | ---------------------------------------------------------------------------------- |
| `_id`               | ObjectId              | Yes      | Auto       | Primary key                                                                        |
| `type`              | String                | Yes      | -          | Question type: `'multiple_choice'`, `'essay'`, `'short_answer'`, or `'true_false'` |
| `content`           | String                | Yes      | -          | Question text/content                                                              |
| `options`           | Array[QuestionOption] | No       | -          | Array of options for multiple choice questions                                     |
| `correctAnswer`     | Mixed                 | No       | -          | Correct answer (String for text, Object for true/false)                            |
| `explanation`       | String                | No       | -          | Detailed explanation for review mode                                               |
| `linkedPassageId`   | String                | No       | -          | ID linking to reading passage (indexed)                                            |
| `image`             | Object                | No       | -          | Image attachment with url, caption, and position                                   |
| `image.url`         | String                | No       | -          | URL to image                                                                       |
| `image.caption`     | String                | No       | -          | Image caption                                                                      |
| `image.position`    | String                | No       | `'top'`    | Image position: `'top'` or `'bottom'`                                              |
| `tableData`         | Object                | No       | -          | Table data for Math/Geography subjects                                             |
| `tableData.headers` | Array[String]         | No       | -          | Table headers                                                                      |
| `tableData.rows`    | Array[Array[String]]  | No       | -          | Table rows data                                                                    |
| `difficulty`        | String                | Yes      | `'medium'` | Difficulty level: `'easy'`, `'medium'`, or `'hard'`                                |
| `subject`           | String                | Yes      | -          | Subject/topic of the question (indexed)                                            |
| `tags`              | Array[String]         | No       | -          | Tags for categorization/layout classification                                      |
| `points`            | Number                | Yes      | `1`        | Default points for this question                                                   |
| `createdBy`         | ObjectId              | No       | -          | Reference to User (creator)                                                        |
| `isPublic`          | Boolean               | Yes      | `false`    | Whether the question is public                                                     |

### QuestionOption Sub-schema

| Field       | Type    | Required | Description                     |
| ----------- | ------- | -------- | ------------------------------- |
| `id`        | String  | Yes      | Option ID (e.g., "A", "B", "C") |
| `content`   | String  | Yes      | Option text content             |
| `isCorrect` | Boolean | No       | Whether this option is correct  |

**Note:** QuestionOption does not have `_id` field (disabled for custom ID usage).

### Indexes

- `subject`, `difficulty` (compound)
- `tags`
- `createdBy`
- `linkedPassageId`

### Relationships

- **Many-to-One** with `User` (creator)
- **One-to-Many** with `ExamQuestion`
- **One-to-Many** with `ExamAnswer`

---

## 7. ExamQuestion

**Collection Name:** `examquestions`

**Description:** Junction table linking questions to exams with ordering, scoring, and section grouping.

### Attributes

| Field        | Type     | Required | Default | Description                                             |
| ------------ | -------- | -------- | ------- | ------------------------------------------------------- |
| `_id`        | ObjectId | Yes      | Auto    | Primary key                                             |
| `examId`     | ObjectId | Yes      | -       | Reference to Exam                                       |
| `questionId` | ObjectId | Yes      | -       | Reference to Question                                   |
| `order`      | Number   | Yes      | -       | Order of question in the exam                           |
| `maxScore`   | Number   | Yes      | `1`     | Maximum score for this question in this exam            |
| `section`    | String   | No       | `''`    | Section name for grouping (e.g., "Phần I: Trắc nghiệm") |
| `points`     | Number   | No       | -       | Alternative points field (for frontend compatibility)   |

### Indexes

- `examId`, `questionId` (compound, unique)
- `examId`, `order` (compound)

### Relationships

- **Many-to-One** with `Exam`
- **Many-to-One** with `Question`

---

## 8. ExamAssignment

**Collection Name:** `examassignments`

**Description:** Assigns exams to classes with specific time windows and settings.

### Attributes

| Field                 | Type     | Required | Default | Description                          |
| --------------------- | -------- | -------- | ------- | ------------------------------------ |
| `_id`                 | ObjectId | Yes      | Auto    | Primary key                          |
| `examId`              | ObjectId | Yes      | -       | Reference to Exam                    |
| `classId`             | ObjectId | Yes      | -       | Reference to Class                   |
| `startTime`           | Date     | Yes      | -       | When the exam becomes available      |
| `endTime`             | Date     | Yes      | -       | When the exam closes                 |
| `shuffleQuestions`    | Boolean  | Yes      | `false` | Whether to shuffle questions         |
| `allowLateSubmission` | Boolean  | Yes      | `false` | Whether late submissions are allowed |
| `attemptLimit`        | Number   | Yes      | `1`     | Maximum number of attempts allowed   |
| `createdAt`           | Date     | Yes      | Auto    | Timestamp of creation                |
| `updatedAt`           | Date     | Yes      | Auto    | Timestamp of last update             |

### Indexes

- `examId`
- `classId`
- `startTime`, `endTime` (compound)

### Relationships

- **Many-to-One** with `Exam`
- **Many-to-One** with `Class`
- **One-to-Many** with `ExamSubmission`

---

## 9. ExamSubmission

**Collection Name:** `examsubmissions`

**Description:** Tracks student submissions for assigned exams or contest participation.

### Attributes

| Field             | Type     | Required | Default         | Description                                                                |
| ----------------- | -------- | -------- | --------------- | -------------------------------------------------------------------------- |
| `_id`             | ObjectId | Yes      | Auto            | Primary key                                                                |
| `assignmentId`    | ObjectId | No       | `null`          | Reference to ExamAssignment (for class assignments)                        |
| `examId`          | ObjectId | No       | `null`          | Reference to Exam (for direct practice)                                    |
| `contestId`       | ObjectId | No       | `null`          | Reference to Contest (for contest submissions)                             |
| `studentUserId`   | ObjectId | Yes      | -               | Reference to User (student)                                                |
| `status`          | String   | Yes      | `'in_progress'` | Submission status: `'in_progress'`, `'submitted'`, `'graded'`, or `'late'` |
| `startedAt`       | Date     | Yes      | `Date.now()`    | When the student started the exam                                          |
| `submittedAt`     | Date     | No       | `null`          | When the student submitted the exam                                        |
| `totalScore`      | Number   | Yes      | `0`             | Total score achieved                                                       |
| `maxScore`        | Number   | Yes      | `10`            | Maximum possible score                                                     |
| `attemptNumber`   | Number   | Yes      | `1`             | Attempt number for this student                                            |
| `durationSeconds` | Number   | Yes      | `0`             | Total time spent in seconds                                                |
| `createdAt`       | Date     | Yes      | Auto            | Timestamp of creation                                                      |
| `updatedAt`       | Date     | Yes      | Auto            | Timestamp of last update                                                   |

### Indexes

- `examId`, `studentUserId` (compound)
- `assignmentId`, `studentUserId` (compound)
- `contestId`, `studentUserId` (compound)
- `studentUserId`
- `status`

### Relationships

- **Many-to-One** with `ExamAssignment`
- **Many-to-One** with `Exam`
- **Many-to-One** with `Contest`
- **Many-to-One** with `User` (student)
- **One-to-Many** with `ExamAnswer`

---

## 10. ExamAnswer

**Collection Name:** `examanswers`

**Description:** Stores individual answers for each question in a submission.

### Attributes

| Field              | Type          | Required | Default | Description                            |
| ------------------ | ------------- | -------- | ------- | -------------------------------------- |
| `_id`              | ObjectId      | Yes      | Auto    | Primary key                            |
| `submissionId`     | ObjectId      | Yes      | -       | Reference to ExamSubmission            |
| `questionId`       | ObjectId      | Yes      | -       | Reference to Question                  |
| `answerText`       | String        | No       | `''`    | Text answer for essay or short answer  |
| `selectedOptions`  | Array[String] | No       | `[]`    | Selected option(s) for multiple choice |
| `score`            | Number        | Yes      | `0`     | Score awarded for this answer          |
| `maxScore`         | Number        | Yes      | `0`     | Maximum possible score                 |
| `feedback`         | String        | No       | -       | Feedback or comments on the answer     |
| `isAutoGraded`     | Boolean       | Yes      | `false` | Whether this was auto-graded           |
| `isManuallyGraded` | Boolean       | Yes      | `false` | Whether this was manually graded       |
| `createdAt`        | Date          | Yes      | Auto    | Timestamp of creation                  |
| `updatedAt`        | Date          | Yes      | Auto    | Timestamp of last update               |

### Indexes

- `submissionId`, `questionId` (compound, unique)
- `submissionId`

### Relationships

- **Many-to-One** with `ExamSubmission`
- **Many-to-One** with `Question`
- **One-to-Many** with `ManualGrading`

---

## 11. ManualGrading

**Collection Name:** `manualgradings`

**Description:** Records manual grading actions by teachers for essay/short answer questions.

### Attributes

| Field       | Type     | Required | Default      | Description                        |
| ----------- | -------- | -------- | ------------ | ---------------------------------- |
| `_id`       | ObjectId | Yes      | Auto         | Primary key                        |
| `answerId`  | ObjectId | Yes      | -            | Reference to ExamAnswer            |
| `graderId`  | ObjectId | Yes      | -            | Reference to User (grader/teacher) |
| `score`     | Number   | Yes      | -            | Score awarded by grader            |
| `comment`   | String   | No       | -            | Grader's comment or feedback       |
| `gradedAt`  | Date     | Yes      | `Date.now()` | Timestamp when graded              |
| `createdAt` | Date     | Yes      | Auto         | Timestamp of creation              |
| `updatedAt` | Date     | Yes      | Auto         | Timestamp of last update           |

### Indexes

- `answerId`
- `graderId`

### Relationships

- **Many-to-One** with `ExamAnswer`
- **Many-to-One** with `User` (grader)

---

## 12. Contest

**Collection Name:** `contests`

**Description:** Represents competitive exam contests.

### Attributes

| Field               | Type     | Required | Default      | Description                                             |
| ------------------- | -------- | -------- | ------------ | ------------------------------------------------------- |
| `_id`               | ObjectId | Yes      | Auto         | Primary key                                             |
| `name`              | String   | Yes      | -            | Contest name (trimmed)                                  |
| `description`       | String   | No       | -            | Contest description                                     |
| `startTime`         | Date     | Yes      | -            | Contest start time                                      |
| `endTime`           | Date     | Yes      | -            | Contest end time                                        |
| `ownerId`           | ObjectId | Yes      | -            | Reference to User (owner)                               |
| `isPublic`          | Boolean  | Yes      | `true`       | Whether the contest is public                           |
| `status`            | String   | Yes      | `'upcoming'` | Contest status: `'upcoming'`, `'ongoing'`, or `'ended'` |
| `participantsCount` | Number   | Yes      | `0`          | Cached count of participants                            |
| `createdAt`         | Date     | Yes      | Auto         | Timestamp of creation                                   |
| `updatedAt`         | Date     | Yes      | Auto         | Timestamp of last update                                |

### Indexes

- `ownerId`
- `startTime`, `endTime` (compound)
- `status`

### Relationships

- **Many-to-One** with `User` (owner)
- **One-to-Many** with `ContestExam`
- **One-to-Many** with `ContestParticipation`

---

## 13. ContestExam

**Collection Name:** `contestexams`

**Description:** Junction table linking exams to contests with ordering and weighting.

### Attributes

| Field       | Type     | Required | Default | Description                                  |
| ----------- | -------- | -------- | ------- | -------------------------------------------- |
| `_id`       | ObjectId | Yes      | Auto    | Primary key                                  |
| `contestId` | ObjectId | Yes      | -       | Reference to Contest                         |
| `examId`    | ObjectId | Yes      | -       | Reference to Exam                            |
| `order`     | Number   | Yes      | -       | Order of exam in the contest                 |
| `weight`    | Number   | Yes      | `1`     | Weight/importance of exam in contest scoring |
| `createdAt` | Date     | Yes      | Auto    | Timestamp of creation                        |
| `updatedAt` | Date     | Yes      | Auto    | Timestamp of last update                     |

### Indexes

- `contestId`, `examId` (compound, unique)
- `contestId`, `order` (compound)

### Relationships

- **Many-to-One** with `Contest`
- **Many-to-One** with `Exam`

---

## 14. ContestParticipation

**Collection Name:** `contestparticipations`

**Description:** Tracks user participation and performance in contests.

### Attributes

| Field            | Type            | Required | Default      | Description                          |
| ---------------- | --------------- | -------- | ------------ | ------------------------------------ |
| `_id`            | ObjectId        | Yes      | Auto         | Primary key                          |
| `contestId`      | ObjectId        | Yes      | -            | Reference to Contest                 |
| `userId`         | ObjectId        | Yes      | -            | Reference to User (participant)      |
| `enrolledAt`     | Date            | Yes      | `Date.now()` | When user enrolled in contest        |
| `totalScore`     | Number          | Yes      | `0`          | Total score across all contest exams |
| `rank`           | Number          | No       | `null`       | User's rank in contest               |
| `percentile`     | Number          | No       | `null`       | User's percentile in contest         |
| `completedExams` | Array[ObjectId] | Yes      | `[]`         | Array of completed Exam IDs          |
| `createdAt`      | Date            | Yes      | Auto         | Timestamp of creation                |
| `updatedAt`      | Date            | Yes      | Auto         | Timestamp of last update             |

### Indexes

- `contestId`, `userId` (compound, unique)

### Relationships

- **Many-to-One** with `Contest`
- **Many-to-One** with `User`
- **References** multiple `Exam` (via completedExams array)

---

## 14. ContestParticipation

**Collection Name:** `contestparticipations`

**Description:** Tracks user participation and performance in contests.

### Attributes

| Field            | Type            | Required | Default      | Description                          |
| ---------------- | --------------- | -------- | ------------ | ------------------------------------ |
| `_id`            | ObjectId        | Yes      | Auto         | Primary key                          |
| `contestId`      | ObjectId        | Yes      | -            | Reference to Contest                 |
| `userId`         | ObjectId        | Yes      | -            | Reference to User (participant)      |
| `enrolledAt`     | Date            | Yes      | `Date.now()` | When user enrolled in contest        |
| `totalScore`     | Number          | Yes      | `0`          | Total score across all contest exams |
| `rank`           | Number          | No       | `null`       | User's rank in contest               |
| `percentile`     | Number          | No       | `null`       | User's percentile in contest         |
| `completedExams` | Array[ObjectId] | Yes      | `[]`         | Array of completed Exam IDs          |
| `createdAt`      | Date            | Yes      | Auto         | Timestamp of creation                |
| `updatedAt`      | Date            | Yes      | Auto         | Timestamp of last update             |

### Indexes

- `contestId`, `userId` (compound, unique)

### Relationships

- **Many-to-One** with `Contest`
- **Many-to-One** with `User`
- **References** multiple `Exam` (via completedExams array)

---

## 15. ForumPackage

**Collection Name:** `forumpackages`

**Description:** Contains forum content packages generated from VnSocial articles with multiple discussion topics.

### Attributes

| Field                     | Type            | Required | Default       | Description                                       |
| ------------------------- | --------------- | -------- | ------------- | ------------------------------------------------- |
| `_id`                     | ObjectId        | Yes      | Auto          | Primary key                                       |
| `packageTitle`            | String          | Yes      | -             | Package title (AI-generated, trimmed)             |
| `packageSummary`          | String          | Yes      | -             | Content summary (150-300 words)                   |
| `sourceArticle`           | Object          | Yes      | -             | Source article information                        |
| `sourceArticle.articleId` | ObjectId        | Yes      | -             | Reference to VnsocialArticle                      |
| `sourceArticle.title`     | String          | No       | -             | Article title                                     |
| `sourceArticle.url`       | String          | No       | -             | Article URL                                       |
| `vnsocialTopic`           | Object          | No       | -             | VnSocial topic information                        |
| `vnsocialTopic.topicId`   | ObjectId        | No       | -             | Reference to VnsocialTopic                        |
| `vnsocialTopic.name`      | String          | No       | -             | Topic name                                        |
| `createdBy`               | ObjectId        | Yes      | -             | Reference to User (admin)                         |
| `forumTopics`             | Array[ObjectId] | Yes      | `[]`          | Array of ForumTopic IDs in this package           |
| `status`                  | String          | Yes      | `'published'` | Status: `'draft'`, `'published'`, or `'archived'` |
| `tags`                    | Array[String]   | No       | `[]`          | Tags for categorization                           |
| `rawSmartbotPayload`      | Mixed           | No       | -             | Raw payload from SmartBot API                     |
| `createdAt`               | Date            | Yes      | Auto          | Timestamp of creation                             |
| `updatedAt`               | Date            | Yes      | Auto          | Timestamp of last update                          |

### Indexes

- `createdBy`
- `status`, `createdAt` (compound, descending)
- `vnsocialTopic.topicId`
- `sourceArticle.articleId`
- `tags`

### Relationships

- **Many-to-One** with `User` (creator)
- **Many-to-One** with `VnsocialArticle` (source)
- **Many-to-One** with `VnsocialTopic`
- **One-to-Many** with `ForumTopic`

---

## 16. ForumTopic

**Collection Name:** `forumtopics`

**Description:** Individual discussion topics with seed comments and essay prompts.

### Attributes

| Field                     | Type          | Required | Default       | Description                                       |
| ------------------------- | ------------- | -------- | ------------- | ------------------------------------------------- |
| `_id`                     | ObjectId      | Yes      | Auto          | Primary key                                       |
| `title`                   | String        | Yes      | -             | Topic title (trimmed)                             |
| `packageId`               | ObjectId      | Yes      | -             | Reference to ForumPackage                         |
| `sourceArticle`           | Object        | No       | -             | Source article information                        |
| `sourceArticle.articleId` | ObjectId      | No       | -             | Reference to VnsocialArticle                      |
| `sourceArticle.title`     | String        | No       | -             | Article title                                     |
| `sourceArticle.url`       | String        | No       | -             | Article URL                                       |
| `vnsocialTopic`           | Object        | No       | -             | VnSocial topic information                        |
| `vnsocialTopic.topicId`   | ObjectId      | No       | -             | Reference to VnsocialTopic                        |
| `vnsocialTopic.name`      | String        | No       | -             | Topic name                                        |
| `createdBy`               | ObjectId      | Yes      | -             | Reference to User (admin)                         |
| `seedComment`             | String        | Yes      | -             | AI-generated seed comment (~200 words)            |
| `essayPrompt`             | String        | Yes      | -             | Essay prompt related to the topic                 |
| `status`                  | String        | Yes      | `'published'` | Status: `'draft'`, `'published'`, or `'archived'` |
| `stats`                   | Object        | No       | -             | Statistics object                                 |
| `stats.totalComments`     | Number        | No       | `0`           | Total number of comments                          |
| `stats.totalLikes`        | Number        | No       | `0`           | Total likes received                              |
| `stats.totalViews`        | Number        | No       | `0`           | Total views                                       |
| `tags`                    | Array[String] | No       | `[]`          | Tags for categorization                           |
| `examId`                  | ObjectId      | No       | -             | Reference to related Exam                         |
| `createdAt`               | Date          | Yes      | Auto          | Timestamp of creation                             |
| `updatedAt`               | Date          | Yes      | Auto          | Timestamp of last update                          |

### Indexes

- `packageId`
- `createdBy`
- `status`, `createdAt` (compound, descending)
- `vnsocialTopic.topicId`

### Relationships

- **Many-to-One** with `ForumPackage`
- **Many-to-One** with `User` (creator)
- **Many-to-One** with `VnsocialArticle` (source)
- **Many-to-One** with `VnsocialTopic`
- **Many-to-One** with `Exam` (optional)
- **One-to-Many** with `ForumComment`

---

## 17. ForumComment

**Collection Name:** `forumcomments`

**Description:** User comments on forum topics with support for nested replies.

### Attributes

| Field             | Type            | Required | Default    | Description                                      |
| ----------------- | --------------- | -------- | ---------- | ------------------------------------------------ |
| `_id`             | ObjectId        | Yes      | Auto       | Primary key                                      |
| `topicId`         | ObjectId        | Yes      | -          | Reference to ForumTopic                          |
| `userId`          | ObjectId        | Yes      | -          | Reference to User (author)                       |
| `content`         | String          | Yes      | -          | Comment content (trimmed)                        |
| `parentCommentId` | ObjectId        | No       | `null`     | Reference to parent comment (for nested replies) |
| `likesCount`      | Number          | Yes      | `0`        | Number of likes                                  |
| `likedBy`         | Array[ObjectId] | No       | `[]`       | Array of User IDs who liked this comment         |
| `status`          | String          | Yes      | `'active'` | Status: `'active'`, `'deleted'`, or `'hidden'`   |
| `isAiGenerated`   | Boolean         | Yes      | `false`    | Whether this is an AI-generated seed comment     |
| `createdAt`       | Date            | Yes      | Auto       | Timestamp of creation                            |
| `updatedAt`       | Date            | Yes      | Auto       | Timestamp of last update                         |

### Indexes

- `topicId`, `createdAt` (compound, descending)
- `userId`
- `parentCommentId`
- `status`

### Relationships

- **Many-to-One** with `ForumTopic`
- **Many-to-One** with `User` (author)
- **Many-to-One** with `ForumComment` (parent, self-reference)
- **Many-to-Many** with `User` (via likedBy array)

---

## 18. VnsocialTopic

**Collection Name:** `vnsocialtopics`

**Description:** Cached topics from VnSocial API.

### Attributes

| Field          | Type     | Required | Default          | Description                                       |
| -------------- | -------- | -------- | ---------------- | ------------------------------------------------- |
| `_id`          | ObjectId | Yes      | Auto             | Primary key                                       |
| `externalId`   | String   | Yes      | -                | Topic ID from VnSocial API (project_id)           |
| `name`         | String   | Yes      | -                | Topic name                                        |
| `description`  | String   | No       | -                | Topic description                                 |
| `type`         | String   | Yes      | `'TOPIC_POLICY'` | Topic type: `'TOPIC_POLICY'` or `'PERSONAL_POST'` |
| `metadata`     | Mixed    | No       | -                | Additional metadata from API                      |
| `lastSyncedAt` | Date     | Yes      | `Date.now()`     | Last synchronization timestamp                    |
| `createdAt`    | Date     | Yes      | Auto             | Timestamp of creation                             |
| `updatedAt`    | Date     | Yes      | Auto             | Timestamp of last update                          |

### Indexes

- `externalId` (unique)
- `lastSyncedAt`

### Relationships

- **One-to-Many** with `VnsocialArticle`
- **Referenced by** `ForumPackage`
- **Referenced by** `ForumTopic`

---

## 19. VnsocialArticle

**Collection Name:** `vnsocialarticles`

**Description:** Cached articles from VnSocial API.

### Attributes

| Field           | Type     | Required | Default      | Description                                           |
| --------------- | -------- | -------- | ------------ | ----------------------------------------------------- |
| `_id`           | ObjectId | Yes      | Auto         | Primary key                                           |
| `externalId`    | String   | Yes      | -            | Article ID from VnSocial API (docId)                  |
| `topicId`       | ObjectId | Yes      | -            | Reference to VnsocialTopic                            |
| `title`         | String   | Yes      | -            | Article title                                         |
| `content`       | String   | No       | -            | Article content                                       |
| `url`           | String   | No       | -            | URL to original article                               |
| `source`        | String   | Yes      | -            | Source platform (facebook, baochi, youtube, etc.)     |
| `author`        | String   | No       | -            | Article author                                        |
| `publishedDate` | Date     | No       | -            | Original publication date                             |
| `sentiment`     | String   | No       | -            | Sentiment: `'positive'`, `'neutral'`, or `'negative'` |
| `rawPayload`    | Mixed    | No       | -            | Raw payload from VnSocial API                         |
| `lastFetchedAt` | Date     | Yes      | `Date.now()` | Last fetch timestamp for cache invalidation           |
| `createdAt`     | Date     | Yes      | Auto         | Timestamp of creation                                 |
| `updatedAt`     | Date     | Yes      | Auto         | Timestamp of last update                              |

### Indexes

- `externalId` (unique)
- `topicId`, `publishedDate` (compound, descending)
- `source`
- `lastFetchedAt`

### Relationships

- **Many-to-One** with `VnsocialTopic`
- **Referenced by** `ForumPackage`
- **Referenced by** `ForumTopic`
- **One-to-Many** with `UsedArticle`

---

## 20. UsedArticle

**Collection Name:** `usedarticles`

**Description:** Tracks articles that have been used to create forum content with 24-hour TTL.

### Attributes

| Field          | Type     | Required | Default      | Description                     |
| -------------- | -------- | -------- | ------------ | ------------------------------- |
| `_id`          | ObjectId | Yes      | Auto         | Primary key                     |
| `articleId`    | ObjectId | Yes      | -            | Reference to VnsocialArticle    |
| `topicId`      | ObjectId | Yes      | -            | Reference to VnsocialTopic      |
| `forumTopicId` | ObjectId | No       | -            | Reference to ForumTopic created |
| `usedBy`       | ObjectId | Yes      | -            | Reference to User (admin)       |
| `usedAt`       | Date     | Yes      | `Date.now()` | Timestamp when article was used |
| `expireAt`     | Date     | Yes      | `Date + 24h` | Expiration timestamp (TTL)      |
| `createdAt`    | Date     | Yes      | Auto         | Timestamp of creation           |
| `updatedAt`    | Date     | Yes      | Auto         | Timestamp of last update        |

**Note:** Documents automatically expire after 24 hours via MongoDB TTL index.

### Indexes

- `articleId`, `topicId` (compound)
- `topicId`, `usedAt` (compound, descending)
- `expireAt` (TTL index)

### Relationships

- **Many-to-One** with `VnsocialArticle`
- **Many-to-One** with `VnsocialTopic`
- **Many-to-One** with `ForumTopic`
- **Many-to-One** with `User` (usedBy)

---

## Entity Relationship Diagram (ERD) Summary

```
User
├── 1:N → Class (as teacherUserId)
├── 1:N → ClassMember (as studentUserId)
├── 1:N → ClassJoinRequest (as studentUserId)
├── 1:N → Exam (as createdBy)
├── 1:N → Question (as createdBy)
├── 1:N → Contest (as ownerId)
├── 1:N → ContestParticipation (as userId)
├── 1:N → ExamSubmission (as studentUserId)
├── 1:N → ManualGrading (as graderId)
├── 1:N → ForumPackage (as createdBy)
├── 1:N → ForumTopic (as createdBy)
├── 1:N → ForumComment (as userId)
└── 1:N → UsedArticle (as usedBy)

Class
├── N:1 → User (teacherUserId)
├── 1:N → ClassMember
├── 1:N → ClassJoinRequest
└── 1:N → ExamAssignment

Exam
├── N:1 → User (createdBy)
├── EMBEDS → ReadingPassage[] (in readingPassages field)
├── 1:N → ExamQuestion
├── 1:N → ExamAssignment
├── 1:N → ExamSubmission
└── 1:N → ContestExam

Question
├── N:1 → User (createdBy)
├── EMBEDS → QuestionOption[] (in options field)
├── 1:N → ExamQuestion
└── 1:N → ExamAnswer

Contest
├── N:1 → User (ownerId)
├── 1:N → ContestExam
└── 1:N → ContestParticipation

ExamAssignment
├── N:1 → Exam
├── N:1 → Class
└── 1:N → ExamSubmission

ExamSubmission
├── N:1 → ExamAssignment (optional)
├── N:1 → Exam (optional)
├── N:1 → Contest (optional)
├── N:1 → User (studentUserId)
└── 1:N → ExamAnswer

ExamAnswer
├── N:1 → ExamSubmission
├── N:1 → Question
└── 1:N → ManualGrading

ContestParticipation
├── N:1 → Contest
├── N:1 → User
└── REFS → Exam[] (in completedExams array)

ForumPackage
├── N:1 → User (createdBy)
├── N:1 → VnsocialArticle (sourceArticle.articleId)
├── N:1 → VnsocialTopic (vnsocialTopic.topicId)
└── 1:N → ForumTopic (forumTopics array)

ForumTopic
├── N:1 → ForumPackage (packageId)
├── N:1 → User (createdBy)
├── N:1 → VnsocialArticle (sourceArticle.articleId)
├── N:1 → VnsocialTopic (vnsocialTopic.topicId)
├── N:1 → Exam (examId, optional)
└── 1:N → ForumComment

ForumComment
├── N:1 → ForumTopic
├── N:1 → User (userId)
├── N:1 → ForumComment (parentCommentId, self-reference)
└── N:N → User (likedBy array)

VnsocialTopic
├── 1:N → VnsocialArticle
├── REFS BY → ForumPackage
└── REFS BY → ForumTopic

VnsocialArticle
├── N:1 → VnsocialTopic
├── REFS BY → ForumPackage
├── REFS BY → ForumTopic
└── 1:N → UsedArticle

UsedArticle
├── N:1 → VnsocialArticle
├── N:1 → VnsocialTopic
├── N:1 → ForumTopic (optional)
└── N:1 → User (usedBy)
```

---

## Data Types Reference

| MongoDB Type | JavaScript Type | Description                                 |
| ------------ | --------------- | ------------------------------------------- |
| `ObjectId`   | Object          | 12-byte unique identifier                   |
| `String`     | String          | UTF-8 string                                |
| `Number`     | Number          | Double-precision float or integer           |
| `Boolean`    | Boolean         | true or false                               |
| `Date`       | Date            | Unix timestamp stored as 64-bit integer     |
| `Array`      | Array           | Ordered list of values                      |
| `Mixed`      | Any             | Flexible type for arbitrary data structures |

---

## Important Schema Design Notes

### Timestamps

All models use Mongoose `timestamps: true` option which automatically manages `createdAt` and `updatedAt` fields. When timestamps are enabled, these fields are auto-generated and should not be manually set in most cases.

### Embedded vs Referenced Documents

**Embedded Documents** (used for better performance and atomic operations):

- `Exam.readingPassages[]` - Reading passages embedded in exams
- `Question.options[]` - Question options embedded in questions
- `ForumTopic.stats` - Statistics embedded in topics
- `Question.image` - Image data embedded in questions
- `Question.tableData` - Table data embedded in questions

**Referenced Documents** (used for flexibility and to avoid document size limits):

- All other relationships use ObjectId references with the `ref` property for population

### Field Naming Conventions

- Use camelCase for field names
- Use descriptive names that clearly indicate the field's purpose
- For user references, use `[role]UserId` pattern (e.g., `studentUserId`, `teacherUserId`) for clarity
- For reference fields, use `[entity]Id` pattern (e.g., `examId`, `classId`)

### Validation

**String Fields:**

- `trim: true` - Removes leading/trailing whitespace
- `lowercase: true` - Converts to lowercase (emails)
- `uppercase: true` - Converts to uppercase (class codes)

**Enum Fields:**

- Enforce specific allowed values
- Return validation errors for invalid values

**Unique Indexes:**

- Prevent duplicate entries at the database level
- Return duplicate key errors when violated

**Compound Unique Indexes:**

- Ensure uniqueness across multiple fields
- Example: A student can only join a class once (`classId` + `studentUserId`)

### Indexes

**Single Field Indexes:**

- Created for frequently queried fields
- Foreign key fields (ObjectId references)
- Unique identifier fields

**Compound Indexes:**

- For queries involving multiple fields
- Order matters: most selective field first
- Example: `{ status: 1, createdAt: -1 }` for filtering by status and sorting by date

**TTL Indexes:**

- `UsedArticle.expireAt` - Automatically deletes documents after 24 hours
- MongoDB TTL monitor runs every 60 seconds

### Special Features

**TTL (Time To Live):**

- `UsedArticle` documents expire after 24 hours
- Prevents duplicate article usage within 24-hour window
- MongoDB automatically removes expired documents

**Caching Fields:**

- `Exam.totalQuestions` and `Exam.totalPoints` - Avoid counting operations
- `Contest.participantsCount` - Quick access to participant count
- Update these fields when related data changes

**Flexible Submission Types:**

- `ExamSubmission` supports three modes via nullable foreign keys:
  - Class assignment (`assignmentId`)
  - Direct practice (`examId`)
  - Contest participation (`contestId`)

### Migration Notes

If updating from the old schema:

1. `Class.name` → `Class.className`
2. `Class.code` → `Class.classCode`
3. `Class.teacherId` → `Class.teacherUserId`
4. `ClassMember.studentId` → `ClassMember.studentUserId`
5. `ClassMember.joinedAt` → `ClassMember.joinedDate`
6. `ClassJoinRequest.studentId` → `ClassJoinRequest.studentUserId`
7. `ClassJoinRequest.status` values: `'accepted'` → `'approved'`
8. `ExamSubmission.studentId` → `ExamSubmission.studentUserId`
9. `ExamAssignment.maxAttempts` → `ExamAssignment.attemptLimit`
10. `Exam.mode` values: `'practice'` → `'practice_test'`
11. Added `Exam.readingPassages[]` embedded array
12. Added `Exam.totalQuestions` and `Exam.totalPoints` caching fields
13. Added `Question.linkedPassageId` for reading comprehension
14. Added `Question.explanation` for review mode
15. Added `Question.image` and `Question.tableData` for rich content
16. Changed `Question.options[]` structure to include `id` and `content`
17. Added `ExamQuestion.section` and `ExamQuestion.points`
18. Added `ExamSubmission.contestId` and `ExamSubmission.durationSeconds`
19. Added `Contest.participantsCount` caching field
20. Added all Forum and VnSocial models (15-20)

---

## Database Size Considerations

**Document Size Limits:**

- MongoDB maximum document size: 16MB
- Large exams with embedded passages: Monitor size
- Consider pagination for large comment threads

**Index Considerations:**

- Each index increases write operation cost
- Balance query performance with write performance
- Monitor index usage with MongoDB query planner

**Array Fields:**

- `Exam.readingPassages[]` - Typically 1-10 passages
- `ForumPackage.forumTopics[]` - Typically 3-10 topics
- `ContestParticipation.completedExams[]` - Grows with contest progress
- `ForumComment.likedBy[]` - Can grow large; consider separate collection for high-traffic forums

---

## Collection Sizes (Estimated)

| Collection            | Expected Growth | Index Count | Notes                               |
| --------------------- | --------------- | ----------- | ----------------------------------- |
| users                 | Slow            | 2           | Core user base                      |
| classes               | Slow            | 2           | Limited by teachers                 |
| classmembers          | Medium          | 2           | Grows with enrollments              |
| classjoinrequests     | Medium          | 2           | Temporary, cleared after processing |
| exams                 | Medium          | 2           | Created by teachers                 |
| questions             | Large           | 4           | Question bank grows over time       |
| examquestions         | Large           | 2           | Junction table                      |
| examassignments       | Medium          | 3           | Per class per exam                  |
| examsubmissions       | Large           | 5           | Per student per exam                |
| examanswers           | Very Large      | 2           | Per question per submission         |
| manualgradings        | Medium          | 2           | Only for manual grading             |
| contests              | Small           | 3           | Periodic events                     |
| contestexams          | Small           | 2           | Junction table                      |
| contestparticipations | Medium          | 1           | Per user per contest                |
| forumpackages         | Medium          | 5           | Content generation                  |
| forumtopics           | Medium          | 4           | 3-10 per package                    |
| forumcomments         | Large           | 4           | User-generated content              |
| vnsocialtopics        | Small           | 2           | External API cache                  |
| vnsocialarticles      | Large           | 4           | External API cache                  |
| usedarticles          | Small           | 3           | TTL: Auto-deleted after 24h         |

---
