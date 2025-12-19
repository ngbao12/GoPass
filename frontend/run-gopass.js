const axios = require('axios');

// --- CẤU HÌNH ---
const VNSOCIAL_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5oZ2hhbjIzIiwiYWRtaW4iOnRydWUsImVtYWlsIjoibmhnaGFuMjNAYXBjcy5maXR1cy5lZHUudm4iLCJwcm92aW5jZSI6ImFsbCIsInBhY2thZ2UiOiIiLCJpYXQiOjE3NjYwMzQyMTMsImV4cCI6MTc2NjA2MzAxM30.thGDPIy8clb09LvCFg_rNjoY4VJufaDJU4cRoh2ChnE';
const GEMINI_KEY = 'AIzaSyDJFfuMrVm5WBbsp0sGAk8wJbgP-g-913o'; // <--- NHỚ DÁN KEY GEMINI VÀO ĐÂY
const PROJECT_ID = '69438bd945065e19984503e7';

// --- 1. LẤY TIN TỪ VNSOCIAL ---
async function fetchNews() {
    console.log("1. Đang kết nối VnSocial...");
    try {
        const response = await axios.post(
            'https://api-vnsocialplus.vnpt.vn/social-api/v1/projects/hot-posts',
            {
                "project_id": PROJECT_ID,
                "source": "baochi",
                "start_time": Date.now() - (15 * 24 * 60 * 60 * 1000), // Lấy trong 15 ngày qua cho chắc có bài
                "end_time": Date.now()
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': VNSOCIAL_TOKEN
                }
            }
        );

        // Kiểm tra xem dữ liệu có tồn tại không
        const data = response.data;
        if (data && data.object && Array.isArray(data.object) && data.object.length > 0) {
            console.log("Lấy dữ liệu VnSocial thành công!");
            return data.object[0]; // Trả về bài viết đầu tiên
        } else {
            console.log("⚠️ API phản hồi thành công nhưng không tìm thấy bài viết nào.");
            return null;
        }
    } catch (error) {
        const errorMsg = error.response ? JSON.stringify(error.response.data) : error.message;
        console.error("❌ Lỗi VnSocial:", errorMsg);
        return null;
    }
}

// --- 2. GỬI SANG GEMINI SINH ĐỀ VĂN ---
async function generateExam(content) {
    if (!content) return "Nội dung bài báo trống.";
    
    console.log("2. Đang gửi sang Gemini để soạn đề bài...");
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;

    const body = {
        contents: [{
            parts: [{
                text: `Bạn là giáo viên Ngữ văn. Dựa trên nội dung bài báo này: "${content}", hãy soạn DUY NHẤT 01 đề bài nghị luận xã hội khoảng 200 chữ. Chỉ đưa ra câu hỏi đề bài, không viết bài văn mẫu.`
            }]
        }]
    };

    try {
        const res = await axios.post(url, body);
        return res.data.candidates[0].content.parts[0].text;
    } catch (err) {
        if (err.response?.status === 429) return "Lỗi 429: Hết hạn mức gọi AI, hãy đợi 1 phút.";
        return "❌ Lỗi Gemini: " + err.message;
    }
}

// --- 3. CHẠY TỔNG HỢP ---
async function run() {
    console.log("--- BẮT ĐẦU QUY TRÌNH GOPASS ---");
    const news = await fetchNews();
    
    if (news) {
        // VnSocial trả về content trong trường 'content' hoặc 'description'
        const articleTitle = news.title || "Không có tiêu đề";
        const articleContent = news.content || news.description;

        console.log(`=> Bài báo: ${articleTitle}`);
        
        const exam = await generateExam(articleContent);
        
        console.log("\n" + "=".repeat(40));
        console.log("KẾT QUẢ ĐỀ VĂN DÀNH CHO DIỄN ĐÀN:");
        console.log(exam);
        console.log("=".repeat(40) + "\n");
    } else {
        console.log("Kết thúc: Không có dữ liệu để xử lý.");
    }
}

run();