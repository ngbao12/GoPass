# Ngữ Văn AI Grading UI Implementation

## Overview

Implemented a complete teacher interface for grading exams with AI assistance, specifically for Ngữ Văn (Literature) subjects.

## Features Implemented

### 1. Grading Submissions List Page

**Location**: `/dashboard/grading`

**Features**:

- View all student submissions in a table format
- Filter by subject (Toán học, Ngữ Văn, Tiếng Anh, etc.)
- Filter by status (Chờ chấm, Đã chấm)
- Click on any submission to view details and grade
- Summary statistics showing total submissions, pending, and graded

**UI Components**:

- Filter dropdowns for Subject and Status
- Sortable table with columns:
  - Student name & email
  - Exam title
  - Subject badge
  - Status badge
  - Score
  - Submission date
  - Action button
- Stats cards at bottom showing counts

### 2. Grading Detail Page

**Location**: `/dashboard/grading/[submissionId]`

**Features**:

- View complete submission details
- Student information display
- Exam information display
- **AI Auto-Grading Button** (for Ngữ Văn exams only)
  - Prominent gradient button
  - Shows loading state during grading
  - Displays success/error results
  - Only visible for Ngữ Văn subjects
- View all answers with:
  - Question content
  - Student's answer
  - Reference answer (explanation)
  - Current score and feedback
  - AI grading indicator badge
- Summary statistics for the submission

**AI Grading Flow**:

1. Teacher clicks "🤖 Chấm bằng AI" button
2. Confirmation dialog appears
3. Backend calls VnSmartBot API to grade all essay answers
4. Page shows loading state
5. Results displayed with count and total score
6. Page automatically reloads to show updated scores

### 3. Navigation Integration

- Added "Chấm bài" (Grading) tab to teacher navigation
- Positioned between "Đề thi" and "Học sinh" tabs
- Uses checkmark icon
- Routes to `/dashboard/grading`

## Backend Changes

### New API Endpoints

#### 1. Get All Submissions

```
GET /api/grading/submissions?subject=X&status=Y
Authorization: Bearer <teacher-token>
```

**Query Parameters**:

- `subject` (optional): Filter by exam subject
- `status` (optional): Filter by submission status
- `classId` (optional): Filter by class

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "studentId": { "name": "...", "email": "..." },
      "examId": { "title": "...", "subject": "..." },
      "status": "submitted",
      "totalScore": 8.5,
      "submittedAt": "2025-12-21T10:00:00Z"
    }
  ]
}
```

#### 2. Get Submission Detail

```
GET /api/grading/submissions/:submissionId
Authorization: Bearer <token>
```

**Response**:

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "studentId": { "name": "...", "email": "..." },
    "examId": { "title": "...", "subject": "Ngữ Văn" },
    "status": "graded",
    "totalScore": 8.5,
    "answers": [
      {
        "_id": "...",
        "questionId": { "content": "...", "explanation": "..." },
        "answerText": "...",
        "score": 0.75,
        "feedback": "...",
        "isAutoGraded": true
      }
    ]
  }
}
```

#### 3. AI Auto-Grade (Already Existed)

```
POST /api/grading/submissions/:submissionId/auto-grade-ngu-van
Authorization: Bearer <teacher-token>
```

**Response**:

```json
{
  "success": true,
  "data": {
    "success": true,
    "gradedCount": 3,
    "totalScore": 2.5,
    "results": [...]
  }
}
```

### Backend Files Modified

#### `backend/src/controllers/GradingController.js`

Added:

- `getAllSubmissions(req, res)` - List all submissions with filters
- `getSubmissionDetail(req, res)` - Get submission with answers

#### `backend/src/routes/grading.routes.js`

Added routes:

- `GET /submissions` - List submissions
- `GET /submissions/:submissionId` - Get submission detail

#### `backend/src/services/GradingService.js`

Added:

- `getAllSubmissions(filters)` - Query submissions with filtering
- `getSubmissionDetailWithAnswers(submissionId)` - Fetch submission with populated answers

## Frontend Structure

### Services Created

#### `frontend/src/services/grading/grading.service.ts`

**Methods**:

- `getAllSubmissions(filters)` - Fetch all submissions with optional filters
- `getSubmissionDetail(submissionId)` - Fetch submission with answers
- `autoGradeNguVan(submissionId)` - Trigger AI grading
- `gradeAnswer(...)` - Manual grading (prepared for future)
- `updateSubmissionStatus(...)` - Update status (prepared for future)

**Types Exported**:

- `Submission`
- `SubmissionDetail`
- `Answer`
- `GradingResult`
- `AutoGradeResponse`

### Pages Created

#### `frontend/src/app/(protected)/dashboard/grading/page.tsx`

Main grading list view with filters and table

#### `frontend/src/app/(protected)/dashboard/grading/[submissionId]/page.tsx`

Detailed grading view with AI grading capability

### Navigation Updated

#### `frontend/src/components/layout/dashboard/DashboardNavigation.tsx`

Added "Chấm bài" tab for teachers

## How to Use

### For Teachers

1. **Access Grading Interface**:

   - Login as teacher
   - Click "Chấm bài" tab in dashboard navigation
   - Or navigate to `/dashboard/grading`

2. **Filter Submissions**:

   - Select subject from dropdown (e.g., "Ngữ Văn")
   - Select status (Chờ chấm / Đã chấm)
   - Click "Xóa bộ lọc" to reset filters

3. **Grade a Submission**:

   - Click on any row or "Chấm điểm →" button
   - Review student's answers
   - For Ngữ Văn exams: Click "🤖 Chấm bằng AI" button
   - Confirm the action
   - Wait for AI to grade (5-10 seconds)
   - View updated scores and feedback

4. **Review AI Grading**:
   - Check scores for each answer
   - Read AI-generated feedback
   - Look for "🤖 AI đã chấm" badges on graded answers
   - View summary statistics at bottom

## AI Grading Criteria

The AI evaluates based on:

1. **Ưu điểm** (Strengths) - What student did well
2. **Nhược điểm** (Weaknesses) - Areas needing improvement
3. **Thiếu sót** (Missing elements) - Important points not addressed
4. **Ngữ pháp** (Grammar) - Language usage
5. **Lời khuyên** (Advice) - Suggestions for improvement

**Score Range**: 0, 0.25, 0.5, 0.75, 1 (per question)

## Design Features

### Visual Hierarchy

- Gradient background for AI grading section (purple to blue)
- Color-coded status badges
- Subject badges in purple
- Stats cards with color themes

### UX Features

- Loading states with spinners
- Confirmation dialogs for AI grading
- Success/error messages
- Automatic data refresh after grading
- Responsive grid layouts
- Hover effects on interactive elements

### Accessibility

- Clear labels and headings
- Semantic HTML structure
- Keyboard-navigable tables
- ARIA-friendly status indicators

## Error Handling

1. **Backend Errors**:

   - API failures shown in red error boxes
   - Retry buttons provided
   - Console logging for debugging

2. **Subject Validation**:

   - AI grading only available for "Ngữ Văn"
   - Alert shown if attempted on other subjects

3. **Empty States**:
   - "Không có bài thi nào" when no submissions
   - Graceful handling of missing data

## Testing Checklist

- [x] Teacher can access grading page
- [x] Submissions list loads correctly
- [x] Subject filter works
- [x] Status filter works
- [x] Submission detail page loads
- [x] AI grading button appears for Ngữ Văn exams
- [x] AI grading button hidden for non-Ngữ Văn exams
- [x] AI grading triggers successfully
- [x] Scores and feedback update after grading
- [x] Stats display correctly
- [x] Navigation between pages works

## Future Enhancements

1. **Manual Grading Interface**:

   - Add form to manually input scores
   - Rich text editor for feedback
   - Save individual answer grades

2. **Bulk Operations**:

   - Grade multiple submissions at once
   - Export grades to CSV/Excel

3. **Advanced Filtering**:

   - Filter by date range
   - Filter by class
   - Search by student name

4. **Grading Analytics**:

   - Average scores per question
   - Student performance trends
   - AI vs manual grading comparison

5. **Notifications**:
   - Alert students when graded
   - Email notifications
   - In-app notifications

## Files Structure

```
frontend/
├── src/
│   ├── app/(protected)/dashboard/
│   │   └── grading/
│   │       ├── page.tsx                    # List view
│   │       └── [submissionId]/
│   │           └── page.tsx                # Detail view
│   ├── components/layout/dashboard/
│   │   └── DashboardNavigation.tsx         # Updated navigation
│   └── services/grading/
│       ├── grading.service.ts              # API service
│       └── index.ts                        # Exports

backend/
├── src/
│   ├── controllers/
│   │   └── GradingController.js            # Updated controller
│   ├── routes/
│   │   └── grading.routes.js               # Updated routes
│   └── services/
│       └── GradingService.js               # Updated service
```

## Dependencies

No new dependencies added. Uses existing:

- Next.js routing
- Tailwind CSS for styling
- Existing API client setup
- Existing authentication middleware

## Notes

- AI grading runs asynchronously on backend
- Only grades essay questions with `answerText`
- Respects existing manual grades (doesn't overwrite)
- Same scoring scale as manual grading (0-1 with 0.25 increments)
- Feedback stored in Vietnamese for student readability
- Backend already has VnSmartBot integration from previous implementation
