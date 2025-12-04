# Hướng dẫn lấy dữ liệu Courses từ Database

## 1. Cài đặt MongoDB

### macOS (dùng Homebrew):
```bash
# Cài MongoDB Community Edition
brew tap mongodb/brew
brew install mongodb-community@7.0

# Khởi động MongoDB
brew services start mongodb-community@7.0

# Kiểm tra MongoDB đang chạy
brew services list | grep mongodb
```

### Hoặc dùng Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## 2. Tạo dữ liệu mẫu

Sau khi MongoDB đã chạy, tạo dữ liệu mẫu:

```bash
cd backend
npm run seed
```

Script sẽ tạo:
- 6 users (1 admin, 2 teachers, 3 students)
- 4 classes (courses)
- 5 questions
- 3 exams
- Class memberships và exam assignments

## 3. Test API để lấy courses

### Login để lấy token:
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher1@gopass.com",
    "password": "123456"
  }'
```

Lưu `accessToken` từ response.

### Lấy danh sách courses:
```bash
curl http://localhost:5001/api/classes \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Lấy courses theo teacher:
```bash
curl http://localhost:5001/api/classes/teacher/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Lấy courses mà student đã join:
```bash
# Login as student trước
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student1@gopass.com",
    "password": "123456"
  }'

# Lấy courses
curl http://localhost:5001/api/classes/student/me \
  -H "Authorization: Bearer STUDENT_ACCESS_TOKEN"
```

### Lấy chi tiết 1 course:
```bash
curl http://localhost:5001/api/classes/:classId \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Tìm kiếm courses:
```bash
curl "http://localhost:5001/api/classes?search=Web&semester=HK1%202024-2025" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 4. Test accounts đã tạo sẵn

Tất cả đều có password: **123456**

**Admin:**
- admin@gopass.com

**Teachers:**
- teacher1@gopass.com (dạy Web Development, Database)
- teacher2@gopass.com (dạy AI, Algorithms)

**Students:**
- student1@gopass.com (SV001)
- student2@gopass.com (SV002)
- student3@gopass.com (SV003)

## 5. Courses đã tạo sẵn

1. **Lập trình Web nâng cao** (WEB301)
   - Teacher: Nguyễn Văn A
   - 3 students enrolled

2. **Cơ sở dữ liệu** (DB201)
   - Teacher: Nguyễn Văn A
   - 3 students enrolled

3. **Trí tuệ nhân tạo** (AI401)
   - Teacher: Trần Thị B
   - 3 students enrolled

4. **Thuật toán nâng cao** (ALG301)
   - Teacher: Trần Thị B
   - 3 students enrolled

## 6. API Endpoints cho Classes

```
GET    /api/classes              - Lấy tất cả classes (có filter)
GET    /api/classes/:id          - Lấy chi tiết 1 class
POST   /api/classes              - Tạo class mới (teacher only)
PUT    /api/classes/:id          - Update class (teacher only)
DELETE /api/classes/:id          - Xóa class (teacher only)

GET    /api/classes/teacher/me   - Classes của teacher hiện tại
GET    /api/classes/student/me   - Classes mà student đã join

POST   /api/classes/:id/join     - Student xin join class
GET    /api/classes/:id/members  - Lấy members của class
POST   /api/classes/:id/members  - Teacher thêm student vào class
DELETE /api/classes/:id/members/:userId - Teacher kick student

GET    /api/classes/:id/requests - Lấy join requests
PUT    /api/classes/:id/requests/:requestId - Approve/reject request
```

## 7. Response format

```json
{
  "success": true,
  "data": {
    "classes": [
      {
        "_id": "...",
        "name": "Lập trình Web nâng cao",
        "code": "WEB301",
        "description": "Khóa học về React, Node.js và MongoDB",
        "teacher": {
          "_id": "...",
          "fullName": "Nguyễn Văn A",
          "email": "teacher1@gopass.com"
        },
        "semester": "HK1 2024-2025",
        "startDate": "2024-09-01T00:00:00.000Z",
        "endDate": "2025-01-15T00:00:00.000Z",
        "memberCount": 3,
        "createdAt": "...",
        "updatedAt": "..."
      }
    ],
    "total": 4,
    "page": 1,
    "limit": 10
  }
}
```

## 8. Troubleshooting

### MongoDB không connect được:
```bash
# Kiểm tra MongoDB có chạy không
brew services list | grep mongodb

# Hoặc
ps aux | grep mongod

# Restart MongoDB
brew services restart mongodb-community@7.0
```

### Port 5001 bị chiếm:
```bash
# Tìm process
lsof -i :5001

# Kill process
kill -9 <PID>

# Hoặc đổi PORT trong .env
```

### Xóa hết data và seed lại:
```bash
npm run seed
# Script tự động xóa data cũ trước khi tạo mới
```
