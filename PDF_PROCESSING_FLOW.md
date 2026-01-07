# PDF Exam Processing Flow

## Overview

This document describes the complete flow for processing PDF exam files and creating exams with questions in the GoPass system.

## Architecture

### Components

1. **Frontend (React/TypeScript)**

   - `CreateExamModal.tsx`: 4-step wizard for creating exams
   - `examApi.ts`: API client for exam operations

2. **Backend (Node.js/Express)**

   - `ExamController.js`: Handles HTTP requests
   - `PdfProcessorService.js`: Orchestrates PDF processing
   - `ExamService.js`: Exam business logic
   - `QuestionRepository.js`: Question database operations

3. **Python Processing**
   - `convert_pdf_final.py`: Extracts questions from PDF using pdfplumber

### Design Decision: No Separate Server

**Why not use Flask server?**

- Node.js can directly call Python scripts via `child_process`
- Eliminates need to manage separate Python server
- Simpler deployment (single backend service)
- Reduced infrastructure complexity

## Complete Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         User Interaction                            │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ↓
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 1: Basic Information                                          │
│  - User enters: title, description, subject                         │
│  - Validation: title and subject required                           │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ↓
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 2: Upload PDF File                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  User clicks "Chọn file PDF"                                │   │
│  │  ↓                                                           │   │
│  │  POST /api/exams/upload-file (with FormData)                │   │
│  │  ↓                                                           │   │
│  │  Multer saves PDF to backend/uploads/exams/                 │   │
│  │  ↓                                                           │   │
│  │  Returns: { filename, path, size, originalName }            │   │
│  │  ↓                                                           │   │
│  │  Frontend stores uploadedFileInfo                           │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  - Enforces single file upload (confirm before replacing)           │
│  - Continue button disabled until file uploaded                     │
│  - Shows "Thay đổi file" button after successful upload             │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ↓
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 3: Configuration                                              │
│  - User enters: totalQuestions, durationMinutes                     │
│  - Sets: showAnswers preference                                     │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ↓
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 4: Confirmation & Processing                                  │
│  - User reviews all information                                     │
│  - Clicks "Tạo đề thi" button                                       │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ↓
┌─────────────────────────────────────────────────────────────────────┐
│  BACKEND PROCESSING FLOW                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  POST /api/exams/process-pdf                                │   │
│  │  Body: {                                                    │   │
│  │    pdfFilePath: "/uploads/exams/xxx.pdf",                   │   │
│  │    pdfFileName: "original.pdf",                             │   │
│  │    title, description, subject, durationMinutes             │   │
│  │  }                                                          │   │
│  │  ↓                                                           │   │
│  │  ExamController.processExamFromPdf()                        │   │
│  │  ↓                                                           │   │
│  │  PdfProcessorService.processPdfAndCreateExam()              │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ↓
┌─────────────────────────────────────────────────────────────────────┐
│  PYTHON SCRIPT EXECUTION                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  spawn("python", ["convert_pdf_final.py", pdfFilePath])    │   │
│  │  ↓                                                           │   │
│  │  Python reads PDF with pdfplumber                           │   │
│  │  ↓                                                           │   │
│  │  Extracts:                                                  │   │
│  │  - Reading passages (content, instruction)                  │   │
│  │  - Questions (text, options, correct answer, tags)          │   │
│  │  ↓                                                           │   │
│  │  Outputs JSON to stdout:                                    │   │
│  │  {                                                          │   │
│  │    "passages": [...],                                       │   │
│  │    "questions": [...]                                       │   │
│  │  }                                                          │   │
│  │  ↓                                                           │   │
│  │  Node.js captures stdout and parses JSON                    │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ↓
┌─────────────────────────────────────────────────────────────────────┐
│  DATA TRANSFORMATION                                                │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  PdfProcessorService.transformExamData()                    │   │
│  │  ↓                                                           │   │
│  │  Transforms passages to readingPassages format              │   │
│  │  ↓                                                           │   │
│  │  Transforms questions with:                                 │   │
│  │  - createdBy: actual userId (from JWT token)               │   │
│  │  - subject: from user input                                 │   │
│  │  - type: "multiple_choice"                                  │   │
│  │  - tags: from Python extraction (cloze, reading)            │   │
│  │  - points: 0.25 per question                                │   │
│  │  ↓                                                           │   │
│  │  Determines section for each question:                      │   │
│  │  - "Cloze Test" (if cloze tag)                              │   │
│  │  - "Reading Comprehension" (if reading tag)                 │   │
│  │  - "Sentence/Utterance Arrangement" (default)               │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ↓
┌─────────────────────────────────────────────────────────────────────┐
│  DATABASE OPERATIONS                                                │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  1. Create Exam                                             │   │
│  │     ExamService.createExam() →                              │   │
│  │     Creates Exam document with:                             │   │
│  │     - Basic info (title, description, subject)              │   │
│  │     - Embedded readingPassages array                        │   │
│  │     - pdfFilePath, pdfFileName                              │   │
│  │     - totalQuestions, totalPoints                           │   │
│  │     - createdBy: userId                                     │   │
│  │  ↓                                                           │   │
│  │  2. Create Questions                                        │   │
│  │     For each question:                                      │   │
│  │       QuestionRepository.create() →                         │   │
│  │       Creates Question document with:                       │   │
│  │       - content, options, correctAnswer                     │   │
│  │       - linkedPassageId (if reading question)               │   │
│  │       - tags, difficulty, points                            │   │
│  │       - createdBy: userId                                   │   │
│  │  ↓                                                           │   │
│  │  3. Link Questions to Exam                                  │   │
│  │     ExamService.addQuestions() →                            │   │
│  │     Creates ExamQuestion documents:                         │   │
│  │     - examId, questionId, order, section, maxScore          │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ↓
┌─────────────────────────────────────────────────────────────────────┐
│  RESPONSE & UI UPDATE                                               │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Backend returns:                                           │   │
│  │  {                                                          │   │
│  │    success: true,                                           │   │
│  │    data: {                                                  │   │
│  │      exam: { ...examDocument },                             │   │
│  │      questions: [...questionDocuments],                     │   │
│  │      stats: {                                               │   │
│  │        totalQuestions, totalPassages, totalPoints,          │   │
│  │        clozeQuestions, readingQuestions                     │   │
│  │      }                                                      │   │
│  │    }                                                        │   │
│  │  }                                                          │   │
│  │  ↓                                                           │   │
│  │  Frontend shows success alert with stats                    │   │
│  │  ↓                                                           │   │
│  │  Calls onSubmit(exam) to refresh exam list                  │   │
│  │  ↓                                                           │   │
│  │  Closes modal and resets form                               │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## Key Features

### Single File Upload Enforcement

- User can only upload one PDF file
- If file already uploaded, shows confirmation dialog before replacing
- "Continue" button disabled until file successfully uploaded
- Upload button changes to "Thay đổi file" after successful upload

### Dynamic createdBy Field

- **OLD (Hardcoded)**: `createdBy: "u_teacher_01"`
- **NEW (Dynamic)**: `createdBy: req.user.userId` (from JWT token)
- Ensures questions are properly attributed to the teacher who created them

### No Separate Python Server

Instead of running Flask server, we:

1. Use Node.js `child_process.spawn()` to call Python script directly
2. Python script outputs JSON to stdout
3. Node.js captures stdout and parses JSON
4. All processing happens within single backend service

### Error Handling

- **PDF Upload Errors**: Invalid file type, file too large
- **Python Processing Errors**: Script not found, parsing errors, malformed PDF
- **Database Errors**: Failed to create exam/questions
- **User Feedback**: Clear error messages and success statistics

## File Structure

```
backend/
├── src/
│   ├── controllers/
│   │   └── ExamController.js        # processExamFromPdf()
│   ├── services/
│   │   ├── ExamService.js           # createExam(), addQuestions()
│   │   └── PdfProcessorService.js   # NEW: processPdfAndCreateExam()
│   ├── repositories/
│   │   └── QuestionRepository.js    # create()
│   ├── routes/
│   │   └── exam.routes.js           # POST /process-pdf
│   ├── middleware/
│   │   └── upload.js                # Multer configuration
│   ├── folder_process_api/
│   │   ├── convert_pdf_final.py     # UPDATED: outputs JSON to stdout
│   │   ├── exam_processor_api.py    # DEPRECATED: Flask server (not used)
│   │   └── requirements.txt         # pdfplumber dependency
│   └── uploads/
│       └── exams/                   # PDF storage location

frontend/
├── src/
│   ├── features/
│   │   └── dashboard/
│   │       └── components/
│   │           └── teacher/
│   │               └── exams/
│   │                   └── CreateExamModal.tsx  # UPDATED: new flow
│   └── services/
│       └── teacher/
│           └── examApi.ts           # UPDATED: processPdfToExam()
```

## API Endpoints

### 1. Upload PDF File

```
POST /api/exams/upload-file
Auth: Required (Teacher)
Content-Type: multipart/form-data

Request:
- file: PDF file (max 10MB)

Response:
{
  "success": true,
  "data": {
    "filename": "1704643200000-exam.pdf",
    "originalName": "exam.pdf",
    "path": "/uploads/exams/1704643200000-exam.pdf",
    "size": 2048576,
    "mimetype": "application/pdf"
  }
}
```

### 2. Process PDF and Create Exam

```
POST /api/exams/process-pdf
Auth: Required (Teacher)
Content-Type: application/json

Request:
{
  "pdfFilePath": "/uploads/exams/1704643200000-exam.pdf",
  "pdfFileName": "exam.pdf",
  "title": "Đề thi thử THPT 2026",
  "description": "Đề thi được tạo từ PDF",
  "subject": "Tiếng Anh",
  "durationMinutes": 50
}

Response:
{
  "success": true,
  "data": {
    "exam": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "title": "Đề thi thử THPT 2026",
      "subject": "Tiếng Anh",
      "totalQuestions": 40,
      "totalPoints": 10,
      "readingPassages": [...],
      "pdfFilePath": "/uploads/exams/...",
      "createdBy": "actual_user_id"
    },
    "questions": [
      {
        "_id": "question_id_1",
        "content": "Question text",
        "options": [...],
        "correctAnswer": "A",
        "tags": ["cloze"],
        "createdBy": "actual_user_id"
      }
    ],
    "stats": {
      "totalQuestions": 40,
      "totalPassages": 5,
      "totalPoints": 10,
      "clozeQuestions": 5,
      "readingQuestions": 35
    }
  }
}
```

## Loading States

1. **Uploading File**: `isUploading = true`

   - Shows spinner in upload button
   - Text: "Đang tải lên..."

2. **Processing PDF**: `isProcessing = true`

   - Shows spinner in submit button
   - Text: "Đang xử lý PDF..."

3. **Creating Exam**: `isSubmitting = true`
   - Submit button disabled
   - Shows spinner

## Dependencies

### Backend

- `multer`: File upload handling
- Built-in `child_process`: Python script execution

### Python

```bash
pip install pdfplumber
```

## Testing the Flow

1. **Start Backend**:

```bash
cd backend
npm install
npm start
```

2. **Ensure Python Dependencies**:

```bash
cd backend/src/folder_process_api
pip install -r requirements.txt
```

3. **Start Frontend**:

```bash
cd frontend
npm install
npm run dev
```

4. **Test Flow**:

- Login as teacher
- Navigate to Dashboard → Exams
- Click "Tạo đề thi mới"
- Complete 4-step wizard
- Upload PDF in step 2
- Click "Tạo đề thi" in step 4
- Wait for processing (may take 10-30 seconds for large PDFs)
- Check success message with statistics

## Troubleshooting

### Python Script Errors

**Symptom**: "Failed to start Python process"
**Solution**: Ensure Python is in PATH and `convert_pdf_final.py` exists

### PDF Processing Timeout

**Symptom**: Request times out after long wait
**Solution**: Large PDFs may take time - consider adding timeout configuration

### Questions Not Created

**Symptom**: Exam created but no questions
**Solution**: Check Python script output format matches expected structure

### Wrong createdBy Value

**Symptom**: Questions show wrong teacher
**Solution**: Ensure JWT token is valid and userId is extracted correctly

## Future Enhancements

1. **Progress Bar**: Show extraction progress for large PDFs
2. **PDF Preview**: Display PDF in modal before processing
3. **Question Preview**: Show extracted questions before creating exam
4. **Batch Processing**: Process multiple PDFs at once
5. **OCR Support**: Handle scanned PDFs with image text
6. **Format Validation**: Validate PDF structure before processing

## Security Considerations

- File size limit: 10MB (configurable in `upload.js`)
- File type validation: Only PDF files allowed
- Authentication required: Only teachers can upload/process
- File isolation: Each upload gets unique filename
- Path sanitization: Prevent directory traversal attacks

## Performance Notes

- **PDF Processing Time**: ~5-30 seconds depending on PDF size and complexity
- **Question Creation**: ~50-100ms per question
- **Database Operations**: Batched for efficiency
- **Memory Usage**: Python process runs separately, doesn't block Node.js

---

**Last Updated**: January 7, 2026
**Version**: 1.0.0
