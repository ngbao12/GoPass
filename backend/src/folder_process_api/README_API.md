# GoPass Exam Processor API

## 📋 Mô Tả

API server Python để xử lý file JSON đề thi tiếng Anh và chuyển đổi sang format database của GoPass.

## 🚀 Cài Đặt

### 1. Cài đặt dependencies

```bash
cd backend/src/folder_process_api
pip install -r requirements.txt
```

### 2. Kiểm tra file exam_corrected.json

Đảm bảo file `exam_corrected.json` có trong thư mục này.

## 🔧 Cách Sử Dụng

### Bước 1: Khởi động API Server

```bash
python exam_processor_api.py
```

Server sẽ chạy tại: `http://localhost:5002`

### Bước 2: Test API

Mở terminal mới và chạy:

```bash
python test_api.py
```

## 📡 API Endpoints

### 1. Health Check

```http
GET /api/health
```

**Response:**

```json
{
  "status": "healthy",
  "service": "GoPass Exam Processor API",
  "version": "1.0.0",
  "timestamp": "2026-01-07T10:00:00Z"
}
```

### 2. Process Exam

```http
POST /api/process-exam
Content-Type: application/json

{
  "filePath": "exam_corrected.json",
  "saveToFile": true,
  "outputPath": "exam_processed_output.json"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "exam": { ... },
    "passages": [ ... ],
    "questions": [ ... ],
    "examQuestions": [ ... ]
  },
  "stats": {
    "totalQuestions": 50,
    "totalPassages": 3,
    "totalPoints": 12.5,
    "questionsWithPassage": 35,
    "questionsWithoutPassage": 15,
    "clozeQuestions": 5,
    "readingQuestions": 35
  },
  "outputPath": "exam_processed_output.json"
}
```

### 3. Preview Exam

```http
POST /api/preview
Content-Type: application/json

{
  "filePath": "exam_corrected.json",
  "limit": 5
}
```

Preview 5 câu hỏi đầu tiên mà không lưu file.

### 4. Save to Mock Database

```http
POST /api/save-to-mock-db
Content-Type: application/json

{
  "filePath": "exam_corrected.json",
  "mockDbPath": "../../frontend/mock/db.json"
}
```

Tự động thêm data vào file `db.json` của frontend (không ghi đè data cũ).

## 📊 Cấu Trúc Data Output

### Exam Object

```json
{
  "id": "exam-eng-abc123",
  "title": "Đề Thi Thử Tiếng Anh THPT 2026",
  "description": "Đề thi thử môn Tiếng Anh theo cấu trúc mới nhất",
  "subject": "Tiếng Anh",
  "gradeLevel": "12",
  "duration": 90,
  "totalPoints": 12.5,
  "passingScore": 5,
  "isPublic": true,
  "isActive": true,
  "createdBy": "u_teacher_01",
  "createdAt": "2026-01-07T10:00:00Z",
  "updatedAt": "2026-01-07T10:00:00Z"
}
```

### Passage Object

```json
{
  "id": "passage-eng-xyz789",
  "examId": "exam-eng-abc123",
  "order": 1,
  "title": "URBANISATION: A GROWING PHENOMENON",
  "content": "<p>...</p>",
  "createdAt": "2026-01-07T10:00:00Z",
  "updatedAt": "2026-01-07T10:00:00Z"
}
```

### Question Object

```json
{
  "id": "q-eng-def456",
  "type": "multiple_choice",
  "content": "The word settle in paragraph 1 mostly means _______.",
  "options": [
    { "id": "A", "content": "exchange", "isCorrect": false },
    { "id": "B", "content": "announce", "isCorrect": false },
    { "id": "C", "content": "expect", "isCorrect": false },
    { "id": "D", "content": "decide", "isCorrect": true }
  ],
  "correctAnswer": "D",
  "explanation": "<p>...</p>",
  "difficulty": "medium",
  "linkedPassageId": "passage-eng-xyz789",
  "subject": "Tiếng Anh",
  "points": 0.25,
  "isPublic": true,
  "createdBy": "u_teacher_01",
  "tags": ["reading"],
  "createdAt": "2026-01-07T10:00:00Z",
  "updatedAt": "2026-01-07T10:00:00Z"
}
```

### ExamQuestion Object

```json
{
  "id": "eq-eng-ghi789",
  "examId": "exam-eng-abc123",
  "questionId": "q-eng-def456",
  "order": 1,
  "section": "Câu 1",
  "maxScore": 0.25,
  "createdAt": "2026-01-07T10:00:00Z",
  "updatedAt": "2026-01-07T10:00:00Z"
}
```

## 🏷️ Quy Tắc Tags

### Tags được tự động gán dựa trên:

1. **Câu hỏi có passage** → `["reading"]`
2. **Câu điền khuyết (cloze)** (câu 9-13) → `["cloze", "reading"]`
3. **Câu độc lập (không có passage)** → `[]`

### Ví dụ:

- Câu 1-8: Đọc hiểu passage 1 → `["reading"]`
- Câu 9-13: Điền khuyết passage 2 → `["cloze", "reading"]`
- Câu 14-18: Đọc hiểu passage 3 → `["reading"]`
- Câu 19-23: Ngữ pháp độc lập → `[]`

## ⚙️ Cấu Hình

Các giá trị có thể thay đổi trong file `exam_processor_api.py`:

```python
CURRENT_USER_ID = "u_teacher_01"  # ID của giáo viên tạo đề
SUBJECT = "Tiếng Anh"             # Môn học
POINTS_PER_QUESTION = 0.25        # Điểm mỗi câu
QUESTION_TYPE = "multiple_choice" # Loại câu hỏi
```

## 🧪 Testing Workflow

### Test đơn lẻ:

```bash
# 1. Khởi động server
python exam_processor_api.py

# 2. Test bằng curl
curl http://localhost:5002/api/health

# 3. Process exam
curl -X POST http://localhost:5002/api/process-exam \
  -H "Content-Type: application/json" \
  -d '{"filePath": "exam_corrected.json", "saveToFile": true}'
```

### Test tự động:

```bash
python test_api.py
```

Test suite sẽ chạy 4 tests:

1. ✅ Health Check
2. ✅ Preview Exam (3 câu đầu)
3. ✅ Process and Save to JSON
4. ✅ Full Process (all questions)

## 📁 Files Output

Sau khi chạy test, bạn sẽ có:

1. **exam_processed_output.json** - Full data đã xử lý
2. **db.json** (nếu dùng save-to-mock-db) - Data được append vào mock database

## ⚠️ Lưu Ý

1. **Không ghi đè database thật** - Chỉ test với file JSON
2. **Kiểm tra data kỹ** trước khi import vào MongoDB
3. **Tags quan trọng** cho UI rendering - Kiểm tra kỹ logic tags
4. **User ID** phải tồn tại trong database khi import thật

## 🔍 Debug

Nếu có lỗi, kiểm tra:

1. **File path** - Đảm bảo `exam_corrected.json` đúng vị trí
2. **Port 5002** - Không bị chiếm bởi process khác
3. **JSON format** - File input phải đúng cấu trúc
4. **Dependencies** - Đã cài đặt flask và flask-cors

## 📝 Next Steps

Sau khi test OK:

1. Review output JSON file
2. Kiểm tra tags cho từng câu hỏi
3. Verify passage linking
4. Confirm với team trước khi import MongoDB
5. Tích hợp vào backend Express để gọi từ frontend

## 🤝 Support

Nếu có vấn đề:

1. Check server logs
2. Review test output
3. Validate input JSON structure
4. Contact dev team

---

**Author:** GoPass Team  
**Date:** 2026-01-07  
**Version:** 1.0.0
