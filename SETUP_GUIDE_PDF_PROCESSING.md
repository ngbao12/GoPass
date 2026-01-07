# Quick Setup Guide - PDF Exam Processing

## Prerequisites

1. **Python** installed and in PATH
2. **Node.js** and npm installed
3. **MongoDB** running

## Installation Steps

### 1. Install Python Dependencies

```bash
cd backend/src/folder_process_api
pip install -r requirements.txt
```

This installs:

- `pdfplumber` - PDF parsing library

### 2. Verify Python Script

Test the Python script manually:

```bash
cd backend/src/folder_process_api
python convert_pdf_final.py path/to/your/exam.pdf
```

Should output JSON to console.

### 3. Backend Setup

```bash
cd backend
npm install
```

Make sure these dependencies are installed:

- `multer` - already in package.json
- `express`, `mongoose` - already installed

### 4. Frontend Setup

```bash
cd frontend
npm install
```

## Running the Application

### 1. Start Backend

```bash
cd backend
npm start
# or
npm run dev
```

Backend runs on `http://localhost:5000`

### 2. Start Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:3000`

## Testing the Flow

### Step-by-Step Test

1. **Login as Teacher**

   - Email: teacher account
   - Navigate to Dashboard → Exams

2. **Create New Exam**

   - Click "Tạo đề thi mới" button
   - Modal opens with 4 steps

3. **Step 1: Basic Info**

   - Enter title: "Đề thi thử THPT 2026"
   - Enter subject: "Tiếng Anh"
   - Enter description (optional)
   - Click "Tiếp tục"

4. **Step 2: Upload PDF** ⭐

   - Click "Chọn file PDF"
   - Select a PDF exam file (max 10MB)
   - Wait for upload to complete
   - See green checkmark and file info
   - "Continue" button now enabled
   - Try uploading another file (should ask for confirmation)

5. **Step 3: Configuration**

   - Enter total questions: 40
   - Enter duration: 50 minutes
   - Toggle "Show answers" if needed
   - Click "Tiếp tục"

6. **Step 4: Confirmation**
   - Review all information
   - Click "Tạo đề thi"
   - See "Đang xử lý PDF..." loading state
   - Wait 5-30 seconds (depending on PDF size)
   - Success popup shows statistics
   - Modal closes and exam appears in list

## Troubleshooting

### Issue: "Python not found"

**Solution**:

```bash
# Windows
where python
# Should output Python path

# If not found, add Python to PATH or use full path in PdfProcessorService.js:
const pythonProcess = spawn("C:\\Python\\python.exe", [...]);
```

### Issue: "pdfplumber not found"

**Solution**:

```bash
pip install pdfplumber
# or
pip3 install pdfplumber
```

### Issue: "File upload failed"

**Check**:

1. File is PDF format
2. File size < 10MB
3. `backend/uploads/exams/` directory exists
4. Backend has write permissions

**Create directory manually**:

```bash
mkdir -p backend/uploads/exams
```

### Issue: "Processing timeout"

**Cause**: Large PDF takes too long

**Solution**: Increase timeout in Node.js spawn:

```javascript
// In PdfProcessorService.js
pythonProcess.on("close", (code) => {
  // Add timeout handling
});

// Or set timeout option
const pythonProcess = spawn("python", [...], {
  timeout: 60000 // 60 seconds
});
```

### Issue: "Questions not created"

**Debug**:

1. Check Python script output manually
2. Verify JSON structure matches expected format
3. Check backend console for errors
4. Inspect database for created exam but missing questions

### Issue: "Wrong teacher ID in questions"

**Check**: JWT token is valid and contains correct userId

## Key Files to Monitor

### Backend Logs

```bash
cd backend
npm start
# Watch for:
# - "PDF processing started"
# - Python script output
# - "Exam created successfully"
```

### Frontend Console

```javascript
// In browser DevTools Console:
// Look for:
console.log("File uploaded successfully:", response.data);
console.log("Processing PDF...");
```

## Environment Variables

No additional environment variables needed! The system uses:

- Existing JWT authentication
- Existing file upload configuration
- Existing database connection

## API Testing with Postman/Thunder Client

### 1. Upload File

```
POST http://localhost:5000/api/exams/upload-file
Headers:
  Authorization: Bearer <your_jwt_token>
Body:
  Form-data
  Key: file, Value: [select PDF file]
```

### 2. Process PDF

```
POST http://localhost:5000/api/exams/process-pdf
Headers:
  Authorization: Bearer <your_jwt_token>
  Content-Type: application/json
Body:
{
  "pdfFilePath": "/uploads/exams/1704643200000-exam.pdf",
  "pdfFileName": "exam.pdf",
  "title": "Test Exam",
  "subject": "Tiếng Anh",
  "durationMinutes": 50
}
```

## Success Criteria

✅ **Upload successful when:**

- File appears in `backend/uploads/exams/`
- Response contains file info
- Frontend shows file preview with size

✅ **Processing successful when:**

- Python script executes without errors
- Exam created in database
- All questions created in database
- ExamQuestion links created
- Success popup shows correct statistics

✅ **End-to-end successful when:**

- New exam appears in teacher's exam list
- Clicking exam shows all questions
- Questions have correct `createdBy` field
- Reading passages are embedded in exam

## Performance Expectations

- **File Upload**: < 2 seconds
- **Small PDF (< 1MB)**: 5-10 seconds processing
- **Medium PDF (1-5MB)**: 10-20 seconds processing
- **Large PDF (5-10MB)**: 20-30 seconds processing

## Next Steps After Setup

1. **Test with Real PDF**: Use actual exam PDF files
2. **Monitor Performance**: Check processing times
3. **Review Questions**: Verify extracted questions are correct
4. **Assign to Class**: Test assigning created exam to class
5. **Student Testing**: Have students take the exam

## Common PDF Formats Supported

✅ **Supported**:

- Text-based PDFs
- Multiple choice questions
- Reading comprehension passages
- Cloze tests (fill in the blank)

❌ **Not Supported** (yet):

- Scanned PDFs (images only)
- Handwritten content
- Complex mathematical equations
- Tables and charts

---

**Need Help?**

- Check `PDF_PROCESSING_FLOW.md` for detailed architecture
- Review backend logs for Python script errors
- Inspect browser DevTools Network tab for API responses
