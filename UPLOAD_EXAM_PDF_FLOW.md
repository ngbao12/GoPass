# Flow Upload và Xử Lý Đề Thi PDF - GoPass

## 📋 Tổng Quan

Document này mô tả chi tiết luồng xử lý khi giáo viên/admin upload file PDF đề thi và hệ thống tự động tạo đề thi với các câu hỏi trong cơ sở dữ liệu.

## 🏗️ Kiến Trúc Hệ Thống

### Components Chính

1. **Frontend (Next.js/React/TypeScript)**

   - `CreateExamModal.tsx` - Modal wizard 4 bước tạo đề thi
   - `examApi.ts` - Service gọi API

2. **Backend (Node.js/Express)**

   - `ExamController.js` - Xử lý HTTP requests
   - `PdfProcessorService.js` - Orchestrate quá trình xử lý PDF
   - `ExamService.js` - Business logic tạo đề thi
   - `QuestionRepository.js` - Thao tác với database câu hỏi
   - `upload.js` (middleware) - Xử lý upload file với Multer

3. **Python Script**
   - `convert_pdf_final.py` - Extract câu hỏi từ PDF bằng pdfplumber

### Thiết Kế: Node.js Gọi Trực Tiếp Python

**Tại sao không dùng Flask server riêng?**

- Node.js có thể gọi trực tiếp Python script qua `child_process.spawn()`
- Giảm độ phức tạp: không cần quản lý thêm server Python
- Deployment đơn giản hơn: chỉ cần 1 backend service
- Giảm latency: không qua HTTP overhead

## 🔄 Flow Chi Tiết (4 Bước)

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        👤 USER INTERACTION                               │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ↓
┌──────────────────────────────────────────────────────────────────────────┐
│  📝 BƯỚC 1: NHẬP THÔNG TIN Cơ BẢN                                        │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  Người dùng nhập:                                                  │  │
│  │  - title: Tên đề thi (required) *                                  │  │
│  │  - subject: Môn học (required) * - dropdown                        │  │
│  │    + Toán, Ngữ Văn, Tiếng Anh, Vật Lý, Hóa Học,                   │  │
│  │      Sinh Học, Lịch Sử, Địa Lý, GDCD                              │  │
│  │  - description: Mô tả (optional)                                   │  │
│  │                                                                     │  │
│  │  Validation:                                                        │  │
│  │  - title và subject bắt buộc                                       │  │
│  │  - Không thể "Tiếp tục" nếu thiếu                                  │  │
│  │                                                                     │  │
│  │  State được lưu trong formData:                                    │  │
│  │  {                                                                 │  │
│  │    title: "",                                                      │  │
│  │    description: "",                                                │  │
│  │    subject: "",                                                    │  │
│  │    ...                                                             │  │
│  │  }                                                                 │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ↓ Click "Tiếp tục"
┌──────────────────────────────────────────────────────────────────────────┐
│  📤 BƯỚC 2: UPLOAD FILE PDF                                              │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  1️⃣ User chọn file PDF                                             │  │
│  │     - Click button "Chọn file PDF"                                 │  │
│  │     - <input type="file" accept=".pdf">                            │  │
│  │     - Validation:                                                  │  │
│  │       • Phải là file PDF                                           │  │
│  │       • Dung lượng ≤ 10MB                                          │  │
│  │       • Chỉ cho phép 1 file (confirm nếu upload lại)              │  │
│  │                                                                     │  │
│  │  2️⃣ Frontend upload file                                           │  │
│  │     handleFileUpload(e) →                                          │  │
│  │     performFileUpload(file) →                                      │  │
│  │     examApi.uploadExamFile(file)                                   │  │
│  │     ↓                                                               │  │
│  │     POST /api/exams/upload-file                                    │  │
│  │     Content-Type: multipart/form-data                              │  │
│  │     Body: FormData with "file" field                               │  │
│  │                                                                     │  │
│  │  3️⃣ Backend xử lý upload (Multer middleware)                       │  │
│  │     upload.single("file") →                                        │  │
│  │     ExamController.uploadExamFile() →                              │  │
│  │     - Lưu file vào: backend/uploads/exams/                         │  │
│  │     - Tên file: timestamp-originalname.pdf                         │  │
│  │     - Return:                                                      │  │
│  │       {                                                            │  │
│  │         success: true,                                             │  │
│  │         data: {                                                    │  │
│  │           filename: "1735678901234-exam.pdf",                      │  │
│  │           path: "/uploads/exams/1735678901234-exam.pdf",           │  │
│  │           size: 2457600,                                           │  │
│  │           originalName: "exam.pdf"                                 │  │
│  │         }                                                          │  │
│  │       }                                                            │  │
│  │                                                                     │  │
│  │  4️⃣ Frontend lưu thông tin file                                    │  │
│  │     setUploadedFile(file)                                          │  │
│  │     setUploadedFileInfo(response.data)                             │  │
│  │     - Hiển thị: ✅ file name, size                                 │  │
│  │     - Button "Thay đổi file" xuất hiện                             │  │
│  │     - Enable button "Tiếp tục"                                     │  │
│  │                                                                     │  │
│  │  ⚠️ Lưu ý:                                                         │  │
│  │  - Nếu upload lại → confirm trước khi thay thế                    │  │
│  │  - File được lưu persistent trên server                           │  │
│  │  - Button "Tiếp tục" disabled nếu chưa upload                     │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ↓ Click "Tiếp tục"
┌──────────────────────────────────────────────────────────────────────────┐
│  ⚙️ BƯỚC 3: CẤU HÌNH ĐỀ THI                                              │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  Người dùng nhập:                                                  │  │
│  │  - totalQuestions: Số câu hỏi (required) * - number input         │  │
│  │  - durationMinutes: Thời gian làm bài (phút) (required) *         │  │
│  │  - showAnswers: Hiển thị đáp án (toggle) - default: false         │  │
│  │  - difficulty: Độ khó (dropdown) - default: "medium"              │  │
│  │    + easy, medium, hard                                            │  │
│  │                                                                     │  │
│  │  State cập nhật formData:                                          │  │
│  │  {                                                                 │  │
│  │    ...previousData,                                                │  │
│  │    totalQuestions: "40",                                           │  │
│  │    durationMinutes: "50",                                          │  │
│  │    showAnswers: false,                                             │  │
│  │    difficulty: "medium"                                            │  │
│  │  }                                                                 │  │
│  │                                                                     │  │
│  │  Validation:                                                        │  │
│  │  - totalQuestions phải >= 1                                        │  │
│  │  - durationMinutes phải > 0                                        │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ↓ Click "Tiếp tục"
┌──────────────────────────────────────────────────────────────────────────┐
│  ✅ BƯỚC 4: XÁC NHẬN VÀ XỬ LÝ                                            │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  1️⃣ Hiển thị tóm tắt                                               │  │
│  │     - Tên đề thi                                                   │  │
│  │     - Môn học                                                      │  │
│  │     - Số câu hỏi                                                   │  │
│  │     - Thời gian                                                    │  │
│  │     - File PDF đã upload                                           │  │
│  │                                                                     │  │
│  │  2️⃣ User click "Tạo đề thi"                                        │  │
│  │     handleSubmit(e) → (nếu currentStep === 4)                      │  │
│  │     - Check: uploadedFileInfo phải tồn tại                         │  │
│  │     - Prevent duplicate: kiểm tra isSubmitting/isProcessing       │  │
│  │     - setIsSubmitting(true)                                        │  │
│  │     - setIsProcessing(true)                                        │  │
│  │                                                                     │  │
│  │  3️⃣ Gọi API xử lý PDF                                              │  │
│  │     examApi.processPdfToExam({                                     │  │
│  │       pdfFilePath: uploadedFileInfo.path,                          │  │
│  │       pdfFileName: uploadedFileInfo.originalName,                  │  │
│  │       title: formData.title,                                       │  │
│  │       description: formData.description,                           │  │
│  │       subject: formData.subject,                                   │  │
│  │       durationMinutes: Number(formData.durationMinutes)            │  │
│  │     })                                                             │  │
│  │     ↓                                                               │  │
│  │     POST /api/exams/process-pdf                                    │  │
│  │     Headers: { Authorization: "Bearer <token>" }                   │  │
│  │     Body: { pdfFilePath, pdfFileName, title, ... }                 │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ↓
┌──────────────────────────────────────────────────────────────────────────┐
│  🔧 BACKEND PROCESSING                                                   │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  ExamController.processExamFromPdf()                               │  │
│  │  ↓                                                                  │  │
│  │  1️⃣ Validate request body                                          │  │
│  │     - Kiểm tra pdfFilePath hoặc pdfFileName                        │  │
│  │     - Nếu có pdfFileName: construct path                           │  │
│  │       filePath = `/uploads/exams/${pdfFileName}`                   │  │
│  │                                                                     │  │
│  │  2️⃣ Get absolute path                                              │  │
│  │     const absolutePdfPath = path.join(                             │  │
│  │       __dirname, "..", "..", filePath                              │  │
│  │     )                                                              │  │
│  │     // VD: C:\...\backend\uploads\exams\file.pdf                  │  │
│  │                                                                     │  │
│  │  3️⃣ Xác định exam mode dựa trên role                               │  │
│  │     const user = await User.findById(req.user.userId)              │  │
│  │     const examMode = user.role === "admin"                         │  │
│  │       ? "practice_global"    // Admin: public exams                │  │
│  │       : "practice_test"      // Teacher: class exams               │  │
│  │                                                                     │  │
│  │  4️⃣ Gọi PdfProcessorService                                        │  │
│  │     const result = await PdfProcessorService                       │  │
│  │       .processPdfAndCreateExam(                                    │  │
│  │         absolutePdfPath,                                           │  │
│  │         {                                                          │  │
│  │           title, description, subject,                             │  │
│  │           durationMinutes, mode: examMode,                         │  │
│  │           shuffleQuestions: false,                                 │  │
│  │           showResultsImmediately: false,                           │  │
│  │           isPublished: false,                                      │  │
│  │           pdfFilePath, pdfFileName                                 │  │
│  │         },                                                         │  │
│  │         req.user.userId                                            │  │
│  │       )                                                            │  │
│  │                                                                     │  │
│  │  5️⃣ Return response                                                │  │
│  │     res.status(201).json({                                         │  │
│  │       success: true,                                               │  │
│  │       data: result,  // { exam, questions, stats }                │  │
│  │       message: "Exam created successfully from PDF"                │  │
│  │     })                                                             │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ↓
┌──────────────────────────────────────────────────────────────────────────┐
│  🐍 PYTHON SCRIPT EXECUTION                                              │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  PdfProcessorService.processPdfToExam()                            │  │
│  │  ↓                                                                  │  │
│  │  1️⃣ Khởi tạo Python process                                        │  │
│  │     const pythonProcess = spawn("python", [                        │  │
│  │       pythonScript,      // convert_pdf_final.py                   │  │
│  │       pdfFilePath        // absolute path to PDF                   │  │
│  │     ], {                                                           │  │
│  │       env: {                                                       │  │
│  │         ...process.env,                                            │  │
│  │         PYTHONIOENCODING: "utf-8"  // Force UTF-8                 │  │
│  │       }                                                            │  │
│  │     })                                                             │  │
│  │                                                                     │  │
│  │  2️⃣ Capture output                                                 │  │
│  │     pythonProcess.stdout.on("data", (data) => {                    │  │
│  │       stdoutData += data.toString("utf8")                          │  │
│  │     })                                                             │  │
│  │                                                                     │  │
│  │     pythonProcess.stderr.on("data", (data) => {                    │  │
│  │       stderrData += data.toString("utf8")                          │  │
│  │       console.warn("Python stderr:", data)                         │  │
│  │     })                                                             │  │
│  │                                                                     │  │
│  │  3️⃣ Python script xử lý PDF                                        │  │
│  │     convert_pdf_final.py:                                          │  │
│  │     ↓                                                               │  │
│  │     a) Đọc PDF với pdfplumber                                      │  │
│  │        with pdfplumber.open(pdf_path) as pdf:                      │  │
│  │          for page in pdf.pages:                                    │  │
│  │            text = extract_with_bold(page)                          │  │
│  │            # Extract với bold tags: <b>text</b>                    │  │
│  │                                                                     │  │
│  │     b) Phân tích cấu trúc đề thi                                   │  │
│  │        - Tìm reading passages (đoạn văn)                           │  │
│  │          Pattern: "Read the following..."                          │  │
│  │        - Tách phần answers                                         │  │
│  │          Pattern: "Answers:" hoặc "Answer:"                        │  │
│  │        - Parse đáp án: "1. A", "2. B", ...                         │  │
│  │                                                                     │  │
│  │     c) Extract questions                                           │  │
│  │        - Split by "Question X." hoặc "Question X:"                 │  │
│  │        - Mỗi question block:                                       │  │
│  │          • question_text (nội dung câu hỏi)                        │  │
│  │          • options: A, B, C, D                                     │  │
│  │          • answer (từ phần answers)                                │  │
│  │          • tags: ["cloze"] hoặc ["reading"] hoặc []               │  │
│  │          • PassageRelated: passage_id nếu thuộc passage           │  │
│  │                                                                     │  │
│  │     d) Xác định question type bằng tags                            │  │
│  │        - "cloze": có pattern (\d+) _____ (fill in blank)          │  │
│  │        - "reading": có keywords như:                               │  │
│  │          "according to", "which of the following",                 │  │
│  │          "the word", "best summarises", "refers to"                │  │
│  │        - []: ordering questions (Q1-Q5 thường là                   │  │
│  │          sentence arrangement với a-, b-, c- items)                │  │
│  │                                                                     │  │
│  │     e) Clean & format                                              │  │
│  │        - Remove watermarks                                         │  │
│  │        - Balance bold tags                                         │  │
│  │        - Convert to HTML:                                          │  │
│  │          • Passages: <p class="mb-4">...</p>                       │  │
│  │          • Questions: <br> separated lines                         │  │
│  │                                                                     │  │
│  │     f) Output JSON to stdout                                       │  │
│  │        print(json.dumps({                                          │  │
│  │          "passages": [                                             │  │
│  │            {                                                       │  │
│  │              "passage_id": "passage_1",                            │  │
│  │              "instruction": "Read the following...",               │  │
│  │              "content": "<p>...</p>"                               │  │
│  │            }                                                       │  │
│  │          ],                                                        │  │
│  │          "questions": [                                            │  │
│  │            {                                                       │  │
│  │              "question_number": 1,                                 │  │
│  │              "question_text": "What is...",                        │  │
│  │              "options": {                                          │  │
│  │                "A": "text A",                                      │  │
│  │                "B": "text B",                                      │  │
│  │                "C": "text C",                                      │  │
│  │                "D": "text D"                                       │  │
│  │              },                                                    │  │
│  │              "answer": "A",                                        │  │
│  │              "PassageRelated": "passage_1",                        │  │
│  │              "tags": ["reading"]                                   │  │
│  │            }                                                       │  │
│  │          ]                                                         │  │
│  │        }, ensure_ascii=False))                                     │  │
│  │                                                                     │  │
│  │  4️⃣ Node.js parse JSON output                                      │  │
│  │     pythonProcess.on("close", (code) => {                          │  │
│  │       if (code !== 0) reject(...)                                  │  │
│  │       const examData = JSON.parse(stdoutData)                      │  │
│  │       const transformed = transformExamData(examData, userId)      │  │
│  │       resolve(transformed)                                         │  │
│  │     })                                                             │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ↓
┌──────────────────────────────────────────────────────────────────────────┐
│  🔄 DATA TRANSFORMATION                                                  │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  PdfProcessorService.transformExamData(examData, userId)           │  │
│  │  ↓                                                                  │  │
│  │  1️⃣ Transform passages                                             │  │
│  │     readingPassages = passages.map((p, i) => ({                    │  │
│  │       id: p.passage_id || `passage-${i+1}`,                        │  │
│  │       title: p.instruction || "",                                  │  │
│  │       content: p.content || ""                                     │  │
│  │     }))                                                            │  │
│  │                                                                     │  │
│  │  2️⃣ Transform questions                                            │  │
│  │     transformedQuestions = questions.map(q => ({                   │  │
│  │       type: "multiple_choice",                                     │  │
│  │       content: q.question_text,                                    │  │
│  │       options: transformOptions(q.options, q.answer),              │  │
│  │       correctAnswer: q.answer,                                     │  │
│  │       explanation: q.explanation || "",                            │  │
│  │       difficulty: "medium",                                        │  │
│  │       linkedPassageId: q.PassageRelated || null,                   │  │
│  │       subject: "Tiếng Anh",  // Từ user input                     │  │
│  │       points: 0.25,                                                │  │
│  │       isPublic: true,                                              │  │
│  │       createdBy: userId,     // Từ JWT token                      │  │
│  │       tags: q.tags || []                                           │  │
│  │     }))                                                            │  │
│  │                                                                     │  │
│  │     Transform options:                                             │  │
│  │     {"A": "text", "B": "text", ...}                                │  │
│  │     ↓                                                               │  │
│  │     [                                                              │  │
│  │       {                                                            │  │
│  │         id: "A",                                                   │  │
│  │         content: "text",                                           │  │
│  │         isCorrect: true/false                                      │  │
│  │       },                                                           │  │
│  │       ...                                                          │  │
│  │     ]                                                              │  │
│  │                                                                     │  │
│  │  3️⃣ Xác định section cho ExamQuestion                              │  │
│  │     examQuestions = questions.map((q, i) => {                      │  │
│  │       let section = "Sentence/Utterance Arrangement"  // Default   │  │
│  │                                                                     │  │
│  │       // LOGIC: Dựa vào tags                                       │  │
│  │       if (q.tags.includes("cloze")) {                              │  │
│  │         section = "Cloze Test"                                     │  │
│  │       } else if (q.tags.includes("reading") ||                     │  │
│  │                  q.PassageRelated) {                               │  │
│  │         section = "Reading Comprehension"                          │  │
│  │       }                                                            │  │
│  │       // else: giữ default "Sentence/Utterance Arrangement"        │  │
│  │                                                                     │  │
│  │       return {                                                     │  │
│  │         questionId: null,  // Sẽ set sau khi create Question      │  │
│  │         order: i + 1,                                              │  │
│  │         section: section,                                          │  │
│  │         maxScore: 0.25                                             │  │
│  │       }                                                            │  │
│  │     })                                                             │  │
│  │                                                                     │  │
│  │  4️⃣ Calculate stats                                                │  │
│  │     stats = {                                                      │  │
│  │       totalQuestions: questions.length,                            │  │
│  │       totalPassages: passages.length,                              │  │
│  │       totalPoints: questions.length * 0.25,                        │  │
│  │       clozeQuestions: questions.filter(q =>                        │  │
│  │         q.tags.includes("cloze")).length,                          │  │
│  │       readingQuestions: questions.filter(q =>                      │  │
│  │         q.tags.includes("reading")).length                         │  │
│  │     }                                                              │  │
│  │                                                                     │  │
│  │  5️⃣ Return transformed data                                        │  │
│  │     return {                                                       │  │
│  │       readingPassages,                                             │  │
│  │       questions: transformedQuestions,                             │  │
│  │       examQuestions,                                               │  │
│  │       stats                                                        │  │
│  │     }                                                              │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ↓
┌──────────────────────────────────────────────────────────────────────────┐
│  💾 DATABASE OPERATIONS                                                  │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  PdfProcessorService.processPdfAndCreateExam()                     │  │
│  │  ↓                                                                  │  │
│  │  1️⃣ CREATE EXAM DOCUMENT                                           │  │
│  │     const examData = {                                             │  │
│  │       title,                                                       │  │
│  │       description: description || "Đề thi từ PDF",                 │  │
│  │       subject: subject || "Tiếng Anh",                             │  │
│  │       durationMinutes: durationMinutes || 50,                      │  │
│  │       mode: examMode,  // "practice_global" hoặc "practice_test"  │  │
│  │       shuffleQuestions: false,                                     │  │
│  │       showResultsImmediately: false,                               │  │
│  │       isPublished: false,                                          │  │
│  │       readingPassages: processedData.readingPassages,  // Array   │  │
│  │       totalQuestions: processedData.questions.length,              │  │
│  │       totalPoints: processedData.stats.totalPoints,                │  │
│  │       pdfFilePath,                                                 │  │
│  │       pdfFileName,                                                 │  │
│  │       createdBy: userId  // Từ JWT token                          │  │
│  │     }                                                              │  │
│  │                                                                     │  │
│  │     const createdExam = await ExamService.createExam(              │  │
│  │       userId,                                                      │  │
│  │       examData                                                     │  │
│  │     )                                                              │  │
│  │     ↓                                                               │  │
│  │     Exam document được tạo trong MongoDB:                          │  │
│  │     {                                                              │  │
│  │       _id: ObjectId("..."),                                        │  │
│  │       title: "Đề thi Tiếng Anh Học kì I",                          │  │
│  │       description: "Đề thi được tạo từ file PDF",                  │  │
│  │       subject: "Tiếng Anh",                                        │  │
│  │       durationMinutes: 50,                                         │  │
│  │       mode: "practice_test",                                       │  │
│  │       readingPassages: [                                           │  │
│  │         {                                                          │  │
│  │           id: "passage_1",                                         │  │
│  │           title: "Read the following...",                          │  │
│  │           content: "<p>Full HTML content...</p>"                   │  │
│  │         }                                                          │  │
│  │       ],                                                           │  │
│  │       totalQuestions: 40,                                          │  │
│  │       totalPoints: 10,                                             │  │
│  │       pdfFilePath: "/uploads/exams/exam123.pdf",                   │  │
│  │       pdfFileName: "de-thi-tieng-anh.pdf",                         │  │
│  │       createdBy: ObjectId("teacher_user_id"),                      │  │
│  │       isPublished: false,                                          │  │
│  │       createdAt: ISODate("..."),                                   │  │
│  │       updatedAt: ISODate("...")                                    │  │
│  │     }                                                              │  │
│  │                                                                     │  │
│  │  2️⃣ CREATE QUESTION DOCUMENTS                                      │  │
│  │     const createdQuestions = []                                    │  │
│  │     for (const questionData of processedData.questions) {          │  │
│  │       const question = await QuestionRepository.create(            │  │
│  │         questionData                                               │  │
│  │       )                                                            │  │
│  │       createdQuestions.push(question)                              │  │
│  │     }                                                              │  │
│  │     ↓                                                               │  │
│  │     Mỗi Question document trong MongoDB:                           │  │
│  │     {                                                              │  │
│  │       _id: ObjectId("..."),                                        │  │
│  │       type: "multiple_choice",                                     │  │
│  │       content: "What is the main idea?",                           │  │
│  │       options: [                                                   │  │
│  │         { id: "A", content: "...", isCorrect: true },              │  │
│  │         { id: "B", content: "...", isCorrect: false },             │  │
│  │         { id: "C", content: "...", isCorrect: false },             │  │
│  │         { id: "D", content: "...", isCorrect: false }              │  │
│  │       ],                                                           │  │
│  │       correctAnswer: "A",                                          │  │
│  │       explanation: "",                                             │  │
│  │       linkedPassageId: "passage_1",  // Hoặc null                 │  │
│  │       difficulty: "medium",                                        │  │
│  │       subject: "Tiếng Anh",                                        │  │
│  │       tags: ["reading"],  // Hoặc ["cloze"] hoặc []               │  │
│  │       points: 0.25,                                                │  │
│  │       createdBy: ObjectId("teacher_user_id"),                      │  │
│  │       isPublic: true,                                              │  │
│  │       createdAt: ISODate("..."),                                   │  │
│  │       updatedAt: ISODate("...")                                    │  │
│  │     }                                                              │  │
│  │                                                                     │  │
│  │  3️⃣ CREATE EXAMQUESTION LINKS                                      │  │
│  │     const examQuestionsToAdd = createdQuestions.map((q, i) => {   │  │
│  │       const examQuestionData = processedData.examQuestions[i]     │  │
│  │       return {                                                     │  │
│  │         questionId: q._id.toString(),                              │  │
│  │         order: examQuestionData.order,                             │  │
│  │         section: examQuestionData.section,                         │  │
│  │         maxScore: examQuestionData.maxScore                        │  │
│  │       }                                                            │  │
│  │     })                                                             │  │
│  │                                                                     │  │
│  │     await ExamService.addQuestions(                                │  │
│  │       createdExam._id.toString(),                                  │  │
│  │       userId,                                                      │  │
│  │       examQuestionsToAdd                                           │  │
│  │     )                                                              │  │
│  │     ↓                                                               │  │
│  │     Mỗi ExamQuestion document trong MongoDB:                       │  │
│  │     {                                                              │  │
│  │       _id: ObjectId("..."),                                        │  │
│  │       examId: ObjectId("exam_id"),                                 │  │
│  │       questionId: ObjectId("question_id"),                         │  │
│  │       order: 1,                                                    │  │
│  │       section: "Reading Comprehension",                            │  │
│  │       // Hoặc "Cloze Test"                                         │  │
│  │       // Hoặc "Sentence/Utterance Arrangement"                     │  │
│  │       maxScore: 0.25,                                              │  │
│  │       createdAt: ISODate("..."),                                   │  │
│  │       updatedAt: ISODate("...")                                    │  │
│  │     }                                                              │  │
│  │                                                                     │  │
│  │  4️⃣ RETURN RESULT                                                  │  │
│  │     return {                                                       │  │
│  │       exam: createdExam,           // Exam document                │  │
│  │       questions: createdQuestions, // Array of Question docs       │  │
│  │       stats: processedData.stats   // Statistics                   │  │
│  │     }                                                              │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ↓
┌──────────────────────────────────────────────────────────────────────────┐
│  🎉 RESPONSE & UI UPDATE                                                 │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  1️⃣ Backend response                                               │  │
│  │     res.status(201).json({                                         │  │
│  │       success: true,                                               │  │
│  │       data: {                                                      │  │
│  │         exam: { ...examDocument },                                 │  │
│  │         questions: [...questionDocuments],                         │  │
│  │         stats: {                                                   │  │
│  │           totalQuestions: 40,                                      │  │
│  │           totalPassages: 2,                                        │  │
│  │           totalPoints: 10,                                         │  │
│  │           clozeQuestions: 10,                                      │  │
│  │           readingQuestions: 25                                     │  │
│  │         }                                                          │  │
│  │       },                                                           │  │
│  │       message: "Exam created successfully from PDF"                │  │
│  │     })                                                             │  │
│  │                                                                     │  │
│  │  2️⃣ Frontend xử lý response                                        │  │
│  │     if (result.success) {                                          │  │
│  │       // Show success notification với stats                       │  │
│  │       setNotification({                                            │  │
│  │         isOpen: true,                                              │  │
│  │         message: `                                                 │  │
│  │           Đề thi đã được tạo thành công!                           │  │
│  │                                                                     │  │
│  │           📊 Thống kê:                                             │  │
│  │           - Tổng số câu hỏi: 40                                    │  │
│  │           - Số đoạn văn: 2                                         │  │
│  │           - Điểm tổng: 10                                          │  │
│  │           - Câu điền từ: 10                                        │  │
│  │           - Câu đọc hiểu: 25                                       │  │
│  │         `,                                                         │  │
│  │         type: "success"                                            │  │
│  │       })                                                           │  │
│  │                                                                     │  │
│  │       // Callback để refresh exam list                             │  │
│  │       await onSubmit(result.data.exam)                             │  │
│  │                                                                     │  │
│  │       // Reset form & close modal                                  │  │
│  │       setFormData({ ... })                                         │  │
│  │       setUploadedFile(null)                                        │  │
│  │       setUploadedFileInfo(null)                                    │  │
│  │       setCurrentStep(1)                                            │  │
│  │       // Modal sẽ đóng sau khi user dismiss notification           │  │
│  │     }                                                              │  │
│  │                                                                     │  │
│  │  3️⃣ UI updates                                                     │  │
│  │     - Exam xuất hiện trong danh sách                               │  │
│  │     - Teacher có thể:                                              │  │
│  │       • Xem chi tiết đề thi                                        │  │
│  │       • Chỉnh sửa câu hỏi                                          │  │
│  │       • Assign cho classes                                         │  │
│  │       • Publish đề thi                                             │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
```

## 📊 Database Schema

### Collections được tạo

#### 1. `exams` Collection

```javascript
{
  _id: ObjectId,
  title: String,                    // "Đề thi Tiếng Anh..."
  description: String,              // Mô tả
  subject: String,                  // "Tiếng Anh", "Toán"...
  durationMinutes: Number,          // 50
  mode: String,                     // "practice_test" | "practice_global"
  shuffleQuestions: Boolean,
  showResultsImmediately: Boolean,
  isPublished: Boolean,
  readingPassages: [                // Embedded array
    {
      id: String,                   // "passage_1"
      title: String,                // Instruction
      content: String               // HTML content
    }
  ],
  totalQuestions: Number,           // 40
  totalPoints: Number,              // 10
  pdfFilePath: String,              // "/uploads/exams/file.pdf"
  pdfFileName: String,              // "original-name.pdf"
  createdBy: ObjectId,              // User ID
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. `questions` Collection

```javascript
{
  _id: ObjectId,
  type: String,                     // "multiple_choice"
  content: String,                  // Câu hỏi (HTML/text)
  options: [                        // Array of options
    {
      id: String,                   // "A", "B", "C", "D"
      content: String,              // Nội dung đáp án
      isCorrect: Boolean            // true/false
    }
  ],
  correctAnswer: String,            // "A"
  explanation: String,              // Giải thích (optional)
  linkedPassageId: String,          // "passage_1" hoặc null
  difficulty: String,               // "easy" | "medium" | "hard"
  subject: String,                  // "Tiếng Anh"
  tags: [String],                   // ["reading"] | ["cloze"] | []
  points: Number,                   // 0.25
  isPublic: Boolean,                // true
  createdBy: ObjectId,              // User ID
  createdAt: Date,
  updatedAt: Date
}
```

#### 3. `examquestions` Collection (Join table)

```javascript
{
  _id: ObjectId,
  examId: ObjectId,                 // Ref to Exam
  questionId: ObjectId,             // Ref to Question
  order: Number,                    // 1, 2, 3...
  section: String,                  // "Reading Comprehension"
                                    // | "Cloze Test"
                                    // | "Sentence/Utterance Arrangement"
  maxScore: Number,                 // 0.25
  createdAt: Date,
  updatedAt: Date
}
```

## 🔑 Key Features

### 1. Single File Upload Enforcement

- Chỉ cho phép upload 1 file tại một thời điểm
- Confirm modal xuất hiện nếu muốn thay thế file
- Validate: PDF only, max 10MB
- File được lưu persistent trên server

### 2. Smart Question Classification

Questions được phân loại tự động dựa trên tags:

```javascript
// LOGIC xác định section:
if (tags.includes("cloze")) {
  section = "Cloze Test"; // Câu điền từ
} else if (tags.includes("reading") || PassageRelated) {
  section = "Reading Comprehension"; // Câu đọc hiểu
} else {
  section = "Sentence/Utterance Arrangement"; // Câu sắp xếp
}
```

**Tags được Python script tự động detect:**

- `"cloze"`: Có pattern `(\d+) _____` (fill in blank)
- `"reading"`: Có keywords: "according to", "which of the following", "the word", etc.
- `[]` (empty): Ordering questions (Q1-Q5, có items a-, b-, c-)

### 3. Exam Mode Based on User Role

```javascript
// Admin tạo public exams, Teacher tạo class exams
const examMode =
  user.role === "admin"
    ? "practice_global" // Public, ai cũng làm được
    : "practice_test"; // Chỉ students trong class của teacher
```

### 4. Reading Passages Embedded

- Reading passages được embed trực tiếp trong Exam document
- Questions link tới passages qua `linkedPassageId`
- Giảm số lượng queries khi load đề thi

### 5. Automatic Stats Calculation

Backend tự động tính:

- `totalQuestions`: Tổng số câu
- `totalPassages`: Số đoạn văn
- `totalPoints`: Tổng điểm (questions \* 0.25)
- `clozeQuestions`: Số câu điền từ
- `readingQuestions`: Số câu đọc hiểu

## 🚨 Error Handling

### Frontend

```javascript
try {
  // API call
} catch (error) {
  setNotification({
    isOpen: true,
    message: "Lỗi: " + error.message,
    type: "error",
  });
} finally {
  setIsSubmitting(false);
  setIsProcessing(false);
}
```

### Backend

```javascript
// ExamController
try {
  const result = await PdfProcessorService.processPdfAndCreateExam(...)
  res.status(201).json({ success: true, data: result })
} catch (error) {
  console.error("Error processing PDF:", error)
  res.status(400).json({
    success: false,
    message: error.message || "Failed to process PDF"
  })
}
```

### Python Script

```python
# Python outputs JSON to stdout
# Node.js captures via pythonProcess.stdout
# Errors captured via pythonProcess.stderr
pythonProcess.stderr.on("data", (data) => {
  stderrData += data.toString("utf8")
  console.warn("Python stderr:", data)
})
```

## ⚙️ Configuration

### File Upload (Multer)

```javascript
// backend/src/middleware/upload.js
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/exams/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files allowed"));
    }
  },
});
```

### Python Environment

```bash
# Required Python packages
pip install pdfplumber

# Environment variables
PYTHONIOENCODING=utf-8  # Force UTF-8 encoding
```

## 📝 API Endpoints

### 1. Upload File

```http
POST /api/exams/upload-file
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body (FormData):
  file: <PDF file>

Response:
{
  "success": true,
  "data": {
    "filename": "1735678901234-exam.pdf",
    "path": "/uploads/exams/1735678901234-exam.pdf",
    "size": 2457600,
    "originalName": "exam.pdf"
  }
}
```

### 2. Process PDF

```http
POST /api/exams/process-pdf
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "pdfFilePath": "/uploads/exams/1735678901234-exam.pdf",
  "pdfFileName": "exam.pdf",
  "title": "Đề thi Tiếng Anh",
  "description": "Đề thi học kì I",
  "subject": "Tiếng Anh",
  "durationMinutes": 50
}

Response:
{
  "success": true,
  "data": {
    "exam": { ...examDocument },
    "questions": [...questionDocuments],
    "stats": {
      "totalQuestions": 40,
      "totalPassages": 2,
      "totalPoints": 10,
      "clozeQuestions": 10,
      "readingQuestions": 25
    }
  },
  "message": "Exam created successfully from PDF"
}
```

## 🐛 Troubleshooting

### Issue: "Python not found"

**Solution:**

```bash
# Windows
where python
# Should output: C:\Python\python.exe

# If not found, add Python to PATH or use full path:
const pythonProcess = spawn("C:\\Python\\python.exe", [...])
```

### Issue: "pdfplumber not found"

**Solution:**

```bash
pip install pdfplumber
# or
pip3 install pdfplumber
```

### Issue: "File upload failed"

**Check:**

1. File là PDF format?
2. File size < 10MB?
3. Directory `backend/uploads/exams/` tồn tại?
4. Backend có write permissions?

**Fix:**

```bash
mkdir -p backend/uploads/exams
chmod 755 backend/uploads/exams
```

### Issue: "Processing timeout"

**Cause:** PDF quá lớn hoặc phức tạp

**Solution:** Increase timeout

```javascript
// In PdfProcessorService.js
const pythonProcess = spawn("python", [...], {
  timeout: 60000 // 60 seconds (default: 30s)
})
```

### Issue: "Questions not created"

**Debug steps:**

1. Chạy Python script thủ công:
   ```bash
   cd backend/src/folder_process_api
   python convert_pdf_final.py path/to/exam.pdf
   ```
2. Kiểm tra JSON output có đúng format?
3. Check backend console logs
4. Xem database có Exam nhưng không có Questions?

### Issue: "Wrong createdBy in questions"

**Check:** JWT token valid và chứa đúng userId

## 📦 Dependencies

### Backend

```json
{
  "express": "^4.18.0",
  "mongoose": "^7.0.0",
  "multer": "^1.4.5-lts.1",
  "jsonwebtoken": "^9.0.0"
}
```

### Python

```txt
pdfplumber==0.10.3
```

### Frontend

```json
{
  "next": "^14.0.0",
  "react": "^18.2.0",
  "typescript": "^5.0.0"
}
```

## 🔐 Security Considerations

1. **File Validation:**

   - Chỉ accept PDF files
   - Giới hạn file size 10MB
   - Scan for malware (nên thêm)

2. **Authentication:**

   - Tất cả routes require JWT token
   - Role-based: teacher/admin only

3. **File Storage:**

   - Files lưu ngoài webroot
   - Tên file được rename (timestamp prefix)
   - Path validation để prevent directory traversal

4. **Input Sanitization:**
   - Validate tất cả user inputs
   - Escape HTML trong content
   - Prevent SQL/NoSQL injection

## 📈 Performance Optimization

1. **Async Processing:**

   - Python script chạy trong child process
   - Không block main thread

2. **Database Indexing:**

   ```javascript
   // Exam indexes
   examSchema.index({ createdBy: 1 });
   examSchema.index({ subject: 1 });
   examSchema.index({ isPublished: 1 });

   // Question indexes
   questionSchema.index({ createdBy: 1 });
   questionSchema.index({ subject: 1, tags: 1 });
   ```

3. **Batch Operations:**

   - Questions được create trong loop (có thể optimize bằng `insertMany`)
   - ExamQuestions được create batch

4. **Caching:**
   - Published exams có thể cache
   - Reading passages embedded trong Exam (giảm joins)

## 🎯 Future Improvements

1. **Background Processing:**

   - Queue system (Bull, RabbitMQ)
   - Process PDF asynchronously
   - Email notification khi hoàn thành

2. **AI Enhancement:**

   - Auto-generate explanations
   - Suggest tags/difficulty
   - Detect duplicate questions

3. **Better Error Recovery:**

   - Retry mechanism
   - Partial success handling
   - Rollback on failure

4. **Multi-format Support:**

   - Word documents (.docx)
   - Images (OCR)
   - LaTeX for Math

5. **Preview Before Submit:**
   - Show extracted questions
   - Allow manual edit
   - Confirm before create

---

**Last Updated:** January 8, 2026
**Version:** 1.0
**Author:** GoPass Development Team
