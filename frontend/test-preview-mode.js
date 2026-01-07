/**
 * Test script để debug Preview Mode
 * Chạy trong browser console khi ở trang preview
 */

console.log("=== Preview Mode Debug Script ===\n");

// 1. Check URL parameters
const url = new URL(window.location.href);
const searchParams = url.searchParams;
console.log("1. URL Parameters:");
console.log("   - Full URL:", window.location.href);
console.log("   - preview param:", searchParams.get("preview"));
console.log("   - assignmentId:", searchParams.get("assignmentId"));
console.log("   - contestId:", searchParams.get("contestId"));
console.log("");

// 2. Check if exam data loaded
console.log("2. Checking React state (inspect in React DevTools):");
console.log("   - Look for TakeExamPage component");
console.log("   - Check exam state");
console.log("   - Check loading state");
console.log("   - Check error state");
console.log("");

// 3. Check network requests
console.log("3. Network Requests (check Network tab):");
console.log("   - Should see: GET /api/exams/{examId}?preview=true");
console.log("   - Status should be: 200");
console.log("   - Response should contain exam data");
console.log("");

// 4. Check localStorage
console.log("4. LocalStorage Check:");
const examId = url.pathname.split("/")[2];
console.log("   - Exam ID:", examId);
if (examId) {
  const storageKey = `exam_${examId}`;
  const savedData = localStorage.getItem(storageKey);
  console.log("   - Storage key:", storageKey);
  console.log("   - Saved data:", savedData ? "EXISTS" : "NONE");
  if (savedData) {
    try {
      const parsed = JSON.parse(savedData);
      console.log("   - Parsed:", parsed);
    } catch (e) {
      console.log("   - Parse error:", e.message);
    }
  }
}
console.log("");

// 5. Check console errors
console.log("5. Console Errors:");
console.log("   - Check for any red errors above");
console.log("   - Common issues:");
console.log("     * TypeScript type errors");
console.log("     * Missing fields in exam data");
console.log("     * Failed API calls");
console.log("");

// 6. Check if ExamProvider initialized
console.log("6. ExamContext Check:");
console.log("   - Open React DevTools");
console.log("   - Find ExamProvider component");
console.log("   - Check context values:");
console.log("     * exam object");
console.log("     * submission object");
console.log("     * currentQuestion");
console.log("     * examState");
console.log("");

// 7. Manual API test
console.log("7. Manual API Test:");
console.log("   Run this in console:\n");
console.log(`
fetch('/api/exams/${examId || "{examId}"}?preview=true', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(data => {
  console.log('API Response:', data);
  if (data.success) {
    console.log('✅ Exam data loaded');
    console.log('   - Title:', data.data.title);
    console.log('   - Questions:', data.data.questions?.length || 0);
    console.log('   - userSubmission:', data.data.userSubmission);
  } else {
    console.log('❌ API failed:', data.message);
  }
})
.catch(err => console.error('❌ Network error:', err));
`);

console.log("\n=== End Debug Info ===");
console.log("Next steps:");
console.log("1. Check Network tab for API call");
console.log("2. Check Console for errors");
console.log("3. Check React DevTools for component state");
console.log("4. Run the manual API test above");
