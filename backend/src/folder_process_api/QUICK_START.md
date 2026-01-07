# 🚀 HƯỚNG DẪN NHANH - GOPASS EXAM PROCESSOR API

## 📦 CÀI ĐẶT (Chỉ làm 1 lần)

```bash
cd backend/src/folder_process_api
pip install -r requirements.txt
```

## ▶️ CÁCH CHẠY

### Cách 1: Dùng Batch Files (Windows)

1. **Khởi động server:**

   - Double click `start_server.bat`
   - Server chạy tại: http://localhost:5002

2. **Chạy tests:**
   - Double click `run_tests.bat`
   - Xem kết quả trong console

### Cách 2: Dùng Command Line

```bash
# Terminal 1 - Khởi động server
python exam_processor_api.py

# Terminal 2 - Chạy tests
python test_api.py
```

## 📊 KẾT QUẢ MONG ĐỢI

Sau khi chạy test, bạn sẽ thấy:

```
🚀 ==================================================================
🚀  GoPass Exam Processor API - Test Suite
🚀 ==================================================================

======================================================================
  TEST 1: Health Check
======================================================================

✅ Server is healthy!

======================================================================
  TEST 2: Preview Processed Exam (First 3 Questions)
======================================================================

✅ Preview successful!

📊 Statistics:
   totalQuestions: 50
   totalPassages: 3
   totalPoints: 12.5
   questionsWithPassage: 35
   questionsWithoutPassage: 15
   clozeQuestions: 5
   readingQuestions: 35

... (more output)

======================================================================
  TEST SUMMARY
======================================================================

✅ PASS - Health Check
✅ PASS - Preview Exam
✅ PASS - Process and Save
✅ PASS - Full Process

📊 Results: 4/4 tests passed

🎉 All tests passed successfully!
```

## 📁 FILES OUTPUT

Sau khi chạy, bạn sẽ có file:

**exam_processed_output.json** - Chứa toàn bộ data đã được xử lý:

```json
{
  "success": true,
  "data": {
    "exam": { ... },           // 1 Exam object
    "passages": [ ... ],       // 3 Passage objects
    "questions": [ ... ],      // 50 Question objects
    "examQuestions": [ ... ]   // 50 ExamQuestion relationships
  },
  "stats": { ... }
}
```

## 🎯 KIỂM TRA DATA

### 1. Kiểm tra cấu trúc:

```bash
# Xem file output
notepad exam_processed_output.json
```

### 2. Kiểm tra tags:

- Câu có passage + không phải cloze → `["reading"]`
- Câu cloze (9-13) → `["cloze", "reading"]`
- Câu độc lập → `[]`

### 3. Kiểm tra passage linking:

- Questions có `linkedPassageId` phải match với Passage `id`

## ✅ CHECKLIST TRƯỚC KHI DÙNG

- [ ] Server chạy thành công (port 5002)
- [ ] 4/4 tests PASS
- [ ] File output tạo ra đúng
- [ ] Tags hợp lý (đọc file output)
- [ ] Passage linking đúng
- [ ] Total points = số câu × 0.25

## 🔄 API ENDPOINTS CHO FRONTEND

Sau khi test OK, frontend có thể gọi:

```javascript
// Process exam file
const response = await fetch("http://localhost:5002/api/process-exam", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    filePath: "exam_corrected.json",
    saveToFile: true,
  }),
});

const result = await response.json();
console.log(result.stats);
```

## ⚠️ LƯU Ý

1. **Chưa kết nối MongoDB** - Chỉ tạo JSON file
2. **User ID mặc định:** `u_teacher_01` - Phải tồn tại trong DB
3. **Subject cố định:** `Tiếng Anh`
4. **Points:** Mỗi câu 0.25 điểm

## 🐛 TROUBLESHOOTING

| Lỗi                        | Nguyên nhân                  | Giải pháp                         |
| -------------------------- | ---------------------------- | --------------------------------- |
| `Port 5002 already in use` | Server đang chạy             | Tắt server cũ                     |
| `File not found`           | Không có exam_corrected.json | Copy file vào đúng folder         |
| `Import error`             | Chưa cài flask               | `pip install -r requirements.txt` |
| `Connection refused`       | Server chưa chạy             | Chạy `start_server.bat`           |

## 📞 NEXT STEPS

Sau khi test OK:

1. ✅ Review file output JSON
2. ✅ Confirm tags và linking
3. ✅ Show cho team check
4. ⏭️ Tích hợp vào backend Express
5. ⏭️ Connect MongoDB (khi ready)
6. ⏭️ Frontend integration

---

**🎉 Good luck!**
