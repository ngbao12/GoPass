# Quick Start: Testing AI Grading UI

## Prerequisites

1. Backend server running on port 5001
2. Frontend server running on port 3000
3. MongoDB connected
4. VnSmartBot API configured

## Step-by-Step Testing

### 1. Start Servers

**Backend**:

```powershell
cd backend
npm run dev
```

**Frontend**:

```powershell
cd frontend
npm run dev
```

### 2. Login as Teacher

1. Open browser: `http://localhost:3000`
2. Login with teacher credentials
3. You should see the dashboard

### 3. Access Grading Interface

**Option 1**: Click Navigation

- Look for "Chấm bài" tab in the top navigation
- Click it to navigate to grading page

**Option 2**: Direct URL

- Navigate to: `http://localhost:3000/dashboard/grading`

### 4. Filter Submissions

1. On the grading page, you'll see filter dropdowns
2. Select "Ngữ Văn" from Subject dropdown
3. Select "Đã nộp" from Status dropdown to see submitted exams
4. The table will update with filtered results

### 5. View Submission Details

1. Click on any row in the table
2. Or click the "Chấm điểm →" button
3. You'll be taken to `/dashboard/grading/[submissionId]`

### 6. Use AI Grading

1. On the submission detail page, look for the purple gradient section
2. You should see "🤖 Chấm điểm tự động bằng AI" heading
3. Click the "🤖 Chấm bằng AI" button
4. Confirm the action in the dialog
5. Wait 5-10 seconds for AI to grade
6. See success message with graded count and total score
7. Scroll down to see updated scores and feedback for each answer

### 7. Verify Results

Check that:

- ✅ Each answer has a score (0, 0.25, 0.5, 0.75, or 1)
- ✅ Feedback is in Vietnamese
- ✅ "🤖 AI đã chấm" badge appears on auto-graded answers
- ✅ Total score at top is updated
- ✅ Stats cards at bottom show correct counts

## Testing Different Scenarios

### Scenario 1: Non-Ngữ Văn Exam

1. Filter by a different subject (e.g., "Toán học")
2. Click on a submission
3. **Expected**: No AI grading button should appear
4. If you try to call the API directly, you'll get an error

### Scenario 2: Already Graded Submission

1. Click a submission that's already graded
2. Click "🤖 Chấm bằng AI" again
3. **Expected**: AI will re-grade the submission
4. Scores may change based on new AI evaluation

### Scenario 3: Empty Filters

1. Don't select any filters
2. **Expected**: See all submissions from all subjects and statuses
3. Use stats cards to see counts

## API Testing (Optional)

### Test Backend Directly

**Get All Submissions**:

```powershell
$token = "your-teacher-jwt-token"
Invoke-WebRequest -Uri "http://localhost:5001/api/grading/submissions?subject=Ngữ Văn" -Headers @{ "Authorization" = "Bearer $token" }
```

**Get Submission Detail**:

```powershell
$submissionId = "your-submission-id"
Invoke-WebRequest -Uri "http://localhost:5001/api/grading/submissions/$submissionId" -Headers @{ "Authorization" = "Bearer $token" }
```

**Trigger AI Grading**:

```powershell
Invoke-WebRequest -Uri "http://localhost:5001/api/grading/submissions/$submissionId/auto-grade-ngu-van" `
  -Method POST `
  -Headers @{ "Authorization" = "Bearer $token" }
```

## Common Issues & Solutions

### Issue 1: "Failed to load submissions"

**Solution**:

- Check backend is running on port 5001
- Check authentication token is valid
- Check database connection

### Issue 2: AI grading button not showing

**Solution**:

- Verify exam subject is exactly "Ngữ Văn" (case-sensitive)
- Check browser console for errors
- Verify submission data loaded correctly

### Issue 3: AI grading fails

**Solution**:

- Check VnSmartBot API credentials in backend
- Check backend console for error logs
- Verify the exam has essay questions with `answerText`

### Issue 4: Scores not updating

**Solution**:

- Wait for the full grading process (can take 10-15 seconds)
- Refresh the page manually
- Check browser network tab for API errors

## Debug Mode

### Browser Console

Press F12 and check:

- Network tab for API calls
- Console tab for errors
- Look for calls to `/api/grading/submissions`

### Backend Console

Watch for these logs:

```
📝 Triggering auto-grading for Ngữ Văn exam...
📋 Auto-grading submission: <submissionId>
🤖 Calling SmartBot for grading...
✅ Auto-grading completed
```

### Database Verification

**Check ExamSubmissions**:

```javascript
use gopass_db
db.examsubmissions.findOne({ _id: ObjectId("your-submission-id") })
```

**Check ExamAnswers**:

```javascript
db.examanswers.find({
  submissionId: ObjectId("your-submission-id"),
  isAutoGraded: true,
});
```

## Success Indicators

You know it's working when:

1. ✅ Grading page loads without errors
2. ✅ Submissions appear in the table
3. ✅ Filters update the list correctly
4. ✅ Clicking a row navigates to detail page
5. ✅ AI grading button appears for Ngữ Văn exams
6. ✅ Clicking AI grading shows loading state
7. ✅ Success message appears after grading
8. ✅ Scores and feedback are visible
9. ✅ Stats cards show correct numbers
10. ✅ Navigation works smoothly

## Next Steps

After verifying the basic functionality:

1. Test with multiple submissions
2. Test with different subjects
3. Test manual grading (future feature)
4. Test with different user roles
5. Test error scenarios

## Support

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review backend logs
3. Check browser console
4. Verify database state
5. Check API responses in network tab
