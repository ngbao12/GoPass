# Test Preview Mode

## Hướng dẫn test

### 1. Mở Browser DevTools

- Nhấn F12 hoặc Right-click > Inspect
- Mở tab Console
- Mở tab Network

### 2. Navigate to Preview Mode

- Vào teacher dashboard: http://localhost:3000/dashboard
- Tìm một exam bất kỳ
- Click button "Xem câu hỏi"
- URL should be: http://localhost:3000/exam/{examId}/take?preview=true

### 3. Check Console Logs

Sẽ thấy các logs theo thứ tự:

```
📖 Fetching exam data... {examId: "...", isPreviewMode: true, ...}
📊 Exam data loaded: {hasData: true, title: "...", questionsCount: 40, ...}
👁️ Preview mode - no submission needed
📋 ExamProvider initialized: {examId: "...", hasUserSubmission: false, ...}
🏁 Render Exam Interface {isPreviewMode: true}
```

**Nếu bị stuck ở loading:**

```
⏳ Waiting for data: {hasExam: true, hasCurrentQuestion: false, ...}
```

### 4. Check Network Tab

**Successful request:**

```
GET /api/exams/{examId}?preview=true
Status: 200
Response: {success: true, data: {...exam data with questions...}}
```

**Backend log:**

```
👁️ Preview mode - skipping submission lookup
```

### 5. Common Issues

#### Issue 1: No questions in exam data

**Symptoms:**

```
⏳ Waiting for data: {hasExam: true, questionsCount: 0}
```

**Cause:** Backend không trả về questions
**Fix:** Check backend ExamService.getExamDetail - ensure questions are populated

#### Issue 2: Questions là empty array

**Symptoms:**

```
⏳ Waiting for data: {hasExam: true, questionsCount: 0, currentIndex: 0}
```

**Cause:** Exam không có questions linked
**Fix:** Check ExamQuestion collection - ensure exam has linked questions

#### Issue 3: API call failed

**Symptoms:**

```
❌ Failed to fetch exam data
Network tab shows: 404 or 500
```

**Cause:** API error hoặc authentication issue
**Fix:**

- Check backend logs
- Check JWT token in localStorage
- Verify exam ID exists

#### Issue 4: TypeScript errors

**Symptoms:**

```
TypeError: Cannot read property 'xxx' of undefined
```

**Cause:** Missing fields in exam data
**Fix:** Check type definitions match backend response

### 6. Manual API Test

Copy & paste vào Console (thay {examId} bằng ID thật):

```javascript
// Get token
const token = localStorage.getItem("token");
console.log("Token:", token ? "EXISTS" : "MISSING");

// Test API
const examId = window.location.pathname.split("/")[2];
console.log("Testing exam:", examId);

fetch(`http://localhost:5000/api/exams/${examId}?preview=true`, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
})
  .then((r) => {
    console.log("Status:", r.status);
    return r.json();
  })
  .then((data) => {
    console.log("✅ Response:", data);
    if (data.success) {
      console.log("📊 Exam:", {
        title: data.data.title,
        questions: data.data.questions?.length || 0,
        hasSubmission: !!data.data.userSubmission,
      });

      if (!data.data.questions || data.data.questions.length === 0) {
        console.error("❌ NO QUESTIONS! Check backend.");
      }
    }
  })
  .catch((err) => {
    console.error("❌ Error:", err);
  });
```

### 7. Expected Behavior

**Preview mode should:**

- ✅ Load exam data without creating submission
- ✅ Show exam interface with all questions
- ✅ Hide timer display (show "Chế độ xem trước" badge instead)
- ✅ Show only "← Quay lại Dashboard" button (no submit button)
- ✅ Allow navigation between questions
- ✅ NOT auto-submit when time runs out
- ✅ NOT save answers to backend (localStorage OK for navigation)

**Preview mode should NOT:**

- ❌ Create ExamSubmission in database
- ❌ Call submission.create API
- ❌ Auto-submit exam
- ❌ Save answers to backend via API
- ❌ Show submit confirmation dialog

### 8. Quick Fixes

**If loading forever:**

1. Check Console for "⏳ Waiting for data:" log
2. Check what's missing (exam/questions/uiLayout)
3. If questionsCount is 0:
   - Backend issue: ExamService not populating questions
   - Or exam has no questions linked

**If API returns empty questions:**

```javascript
// Check in backend MongoDB
db.examquestions.find({ examId: ObjectId("...") });
```

If empty → Exam chưa có questions. Run processPdfToExam again or manually link questions.

### 9. Backend Verification

```bash
# Check backend logs when preview mode is accessed
cd backend
npm run dev

# Should see:
# GET /api/exams/{examId}?preview=true
# 👁️ Preview mode - skipping submission lookup
# 200 response
```

### 10. React DevTools

- Install React DevTools extension
- Open Components tab
- Find: TakeExamPage > TakeExamClient > ExamProvider
- Inspect props and state:
  - `exam` object should have `questions` array
  - `initialExam` should match exam data
  - `isReviewMode` should be `false`
  - `isPreviewMode` should be `true` in ExamInterface
