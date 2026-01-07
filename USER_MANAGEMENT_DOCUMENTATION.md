# User Management System - Documentation

## 📋 Tổng quan

Hệ thống quản lý người dùng cho Admin, bao gồm đầy đủ frontend và backend để quản lý tất cả users trong GoPass.

---

## 🎯 Tính năng

### Admin có thể:

1. ✅ **Xem danh sách người dùng** với phân trang
2. ✅ **Tìm kiếm** người dùng theo tên hoặc email
3. ✅ **Lọc** người dùng theo:
   - Vai trò (Student, Teacher, Admin)
   - Trạng thái (Active, Locked)
4. ✅ **Xem chi tiết** thông tin người dùng
5. ✅ **Khóa/Mở khóa** tài khoản người dùng
6. ✅ **Reset mật khẩu** và gửi email mật khẩu mới
7. ✅ **Xem thống kê** tổng quan hệ thống

---

## 🏗️ Cấu trúc Backend

### Routes (admin.routes.js)

```javascript
// GET /api/admin/users - List users with filters
router.get("/users", AdminController.listUsers);

// GET /api/admin/users/:userId - Get user detail
router.get("/users/:userId", AdminController.getUserDetail);

// PUT /api/admin/users/:userId/status - Update user status
router.put("/users/:userId/status", AdminController.updateUserStatus);

// POST /api/admin/users/:userId/reset-password - Reset password
router.post("/users/:userId/reset-password", AdminController.resetUserPassword);

// GET /api/admin/metrics - Get system metrics
router.get("/metrics", AdminController.getSystemMetrics);
```

**Authentication:** Tất cả routes yêu cầu JWT token và role = "admin"

---

### Controller (AdminController.js)

**Methods:**
- `listUsers(req, res)` - Lấy danh sách users với filter, search, pagination
- `getUserDetail(req, res)` - Lấy chi tiết 1 user
- `updateUserStatus(req, res)` - Cập nhật trạng thái active/locked
- `resetUserPassword(req, res)` - Reset password và gửi email
- `getSystemMetrics(req, res)` - Lấy thống kê hệ thống

---

### Service (AdminService.js)

#### 1. listUsers(filter)

**Input:**
```javascript
{
  role: 'student' | 'teacher' | 'admin',  // Optional
  status: 'active' | 'locked',             // Optional
  keyword: 'search text',                  // Optional
  page: 1,                                 // Default: 1
  limit: 20                                // Default: 20
}
```

**Output:**
```javascript
{
  users: [...],           // Array of sanitized user objects
  total: 150,             // Total users matching filter
  page: 1,                // Current page
  totalPages: 8           // Total pages
}
```

**Logic:**
- Tìm kiếm theo keyword (tên hoặc email)
- Filter theo role và status
- Pagination
- Remove sensitive data (passwordHash)

---

#### 2. getUserDetail(userId)

**Input:** `userId` (string)

**Output:**
```javascript
{
  _id: "...",
  name: "Nguyễn Văn A",
  email: "student@example.com",
  role: "student",
  status: "active",
  avatar: "...",
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2025-01-07T00:00:00.000Z"
}
```

---

#### 3. updateUserStatus(userId, status)

**Input:**
- `userId` (string)
- `status` ('active' | 'locked')

**Output:** Updated user object

**Validation:**
- Status phải là 'active' hoặc 'locked'
- User phải tồn tại

---

#### 4. resetUserPassword(userId)

**Input:** `userId` (string)

**Process:**
1. Tìm user
2. Generate random temporary password (8 ký tự)
3. Hash password và cập nhật DB
4. Gửi email cho user với temporary password

**Output:**
```javascript
{
  message: "Password reset successfully. Email sent to user."
}
```

**Email template:**
```html
<h1>Password Reset</h1>
<p>Hi {user.name},</p>
<p>Your password has been reset by an administrator.</p>
<p>Your temporary password is: <strong>{tempPassword}</strong></p>
<p>Please change your password after logging in.</p>
```

---

#### 5. getSystemMetrics()

**Output:**
```javascript
{
  totalUsers: 150,
  activeUsers: 145,
  students: 120,
  teachers: 25
}
```

---

## 🎨 Cấu trúc Frontend

### Files đã tạo:

```
frontend/src/
├── services/
│   └── admin/
│       ├── admin.service.ts         # API service
│       └── index.ts                 # Export
│
├── features/dashboard/components/admin/
│   ├── UserManagementView.tsx       # Main view
│   ├── UserManagementTable.tsx      # User table
│   ├── UserFilterToolbar.tsx        # Search & filters
│   ├── UserStatsGrid.tsx            # Stats cards
│   ├── Pagination.tsx               # Pagination component
│   └── index.ts                     # Exports
│
├── app/(protected)/dashboard/
│   └── users/
│       └── page.tsx                 # /dashboard/users page
│
└── components/ui/
    └── Badge.tsx                    # Updated with new variants
```

---

### Components

#### 1. UserManagementView (Main Component)

**State Management:**
```typescript
const [users, setUsers] = useState<User[]>([]);
const [metrics, setMetrics] = useState<SystemMetrics>({...});
const [loading, setLoading] = useState(true);
const [searchQuery, setSearchQuery] = useState("");
const [roleFilter, setRoleFilter] = useState<'all' | User['role']>('all');
const [statusFilter, setStatusFilter] = useState<'all' | User['status']>('all');
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
```

**Features:**
- Auto-fetch users on mount and when filters change
- Debounced search (500ms delay)
- Confirmation dialogs for status update and password reset
- Real-time stats update after actions

---

#### 2. UserManagementTable

**Props:**
```typescript
interface UserManagementTableProps {
  users: User[];
  onViewDetail: (userId: string) => void;
  onUpdateStatus: (userId: string, status: 'active' | 'locked') => void;
  onResetPassword: (userId: string) => void;
  loading?: boolean;
}
```

**Features:**
- Avatar display (from URL or generated initials)
- Role badges with colors:
  - Admin: Yellow
  - Teacher: Blue
  - Student: Green
- Status badges:
  - Active: Green
  - Locked: Red
- Action buttons:
  - Xem (View)
  - Khóa/Mở khóa (Lock/Unlock)
  - Reset MK (Reset Password)

---

#### 3. UserFilterToolbar

**Props:**
```typescript
interface UserFilterToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  roleFilter: 'all' | User['role'];
  onRoleFilterChange: (role: 'all' | User['role']) => void;
  statusFilter: 'all' | User['status'];
  onStatusFilterChange: (status: 'all' | User['status']) => void;
}
```

**UI:**
- Search input với icon
- Role dropdown (Tất cả, Học sinh, Giáo viên, Admin)
- Status dropdown (Tất cả, Hoạt động, Đã khóa)

---

#### 4. UserStatsGrid

**Props:**
```typescript
interface UserStatsGridProps {
  metrics: SystemMetrics;
}
```

**Display:**
- 4 stat cards:
  1. Tổng người dùng (Blue)
  2. Đang hoạt động (Green)
  3. Học sinh (Purple)
  4. Giáo viên (Orange)

---

#### 5. Pagination

**Props:**
```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
```

**Features:**
- Smart page number display (max 5 visible)
- Ellipsis (...) for hidden pages
- Previous/Next buttons
- Disable buttons at boundaries

---

### Service (admin.service.ts)

**API Methods:**

```typescript
// List users with filters
adminService.listUsers(params?: ListUsersParams): Promise<UsersListResponse>

// Get user detail
adminService.getUserDetail(userId: string): Promise<User>

// Update user status
adminService.updateUserStatus(userId: string, status: 'active' | 'locked'): Promise<User>

// Reset password
adminService.resetUserPassword(userId: string): Promise<{ message: string }>

// Get system metrics
adminService.getSystemMetrics(): Promise<SystemMetrics>
```

**Auto JWT Handling:**
Tất cả methods sử dụng `httpClient.get/post/put` với `{ requiresAuth: true }`

---

## 🔐 Security

### Backend:

1. **Authentication:** Middleware `authenticate` check JWT token
2. **Authorization:** Middleware `authorize('admin')` check role
3. **Password:** Never return `passwordHash` in API responses
4. **Email:** Send temporary password via secure email

### Frontend:

1. **JWT Token:** Auto-attached to all requests via httpClient
2. **Confirmation:** User must confirm before critical actions
3. **Error Handling:** Graceful error messages, no sensitive data exposed

---

## 🎯 Navigation

### Admin Dashboard có tab mới: "Người dùng"

**Route:** `/dashboard/users`

**Tab order:**
1. Đề thi
2. Ngân hàng đề
3. Tạo Contest
4. **Người dùng** ← NEW
5. Quản lí diễn đàn

**DashboardNavigation.tsx updates:**
- Added "users" tab for admin role
- Added "users" to tabMapping
- Auto-highlight when on `/dashboard/users`

---

## 📊 User Flow Examples

### Flow 1: Admin tìm kiếm và khóa tài khoản học sinh

```
1. Admin login → Dashboard → Click tab "Người dùng"
2. Trang /dashboard/users load
3. UserManagementView fetch users & metrics
4. Admin nhập "Nguyễn" vào search box
5. Sau 500ms, auto-search users có tên "Nguyễn"
6. Admin click "Khóa" trên một user
7. Confirmation dialog hiện
8. Admin click "Xác nhận"
9. API call: PUT /api/admin/users/:userId/status { status: 'locked' }
10. Success → Update UI, refresh metrics
11. Alert: "Đã khóa tài khoản thành công!"
```

---

### Flow 2: Admin reset password cho giáo viên

```
1. Admin ở trang /dashboard/users
2. Admin filter: Vai trò = "Giáo viên"
3. Danh sách chỉ hiện teachers
4. Admin click "Reset MK" trên một teacher
5. Confirmation dialog: "Bạn có chắc muốn reset password cho {name}?"
6. Admin click "Xác nhận"
7. API call: POST /api/admin/users/:userId/reset-password
8. Backend:
   - Generate temp password (e.g., "aB3xY9Zq")
   - Hash và update DB
   - Send email to teacher
9. Success alert: "Password reset successfully. Email sent to user."
10. Teacher nhận email với temp password
11. Teacher login với temp password → Đổi password
```

---

### Flow 3: Admin xem thống kê và phân trang

```
1. Admin vào /dashboard/users
2. UserStatsGrid hiển thị:
   - Tổng người dùng: 150
   - Đang hoạt động: 145
   - Học sinh: 120
   - Giáo viên: 25
3. UserManagementTable hiển thị 20 users (page 1)
4. Pagination: [< 1 2 3 ... 8 >]
5. Admin click page "3"
6. Fetch users với page=3
7. Display users 41-60
8. URL không đổi (client-side pagination)
```

---

## 🧪 Testing

### Backend Testing (Postman/cURL)

#### 1. List Users
```bash
GET http://localhost:5001/api/admin/users?role=student&page=1&limit=10
Authorization: Bearer {admin_jwt_token}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "users": [...],
    "total": 120,
    "page": 1,
    "totalPages": 12
  }
}
```

---

#### 2. Search Users
```bash
GET http://localhost:5001/api/admin/users?keyword=nguyen
Authorization: Bearer {admin_jwt_token}
```

---

#### 3. Get User Detail
```bash
GET http://localhost:5001/api/admin/users/65a1b2c3d4e5f6789012345
Authorization: Bearer {admin_jwt_token}
```

---

#### 4. Update Status
```bash
PUT http://localhost:5001/api/admin/users/65a1b2c3d4e5f6789012345/status
Authorization: Bearer {admin_jwt_token}
Content-Type: application/json

{
  "status": "locked"
}
```

---

#### 5. Reset Password
```bash
POST http://localhost:5001/api/admin/users/65a1b2c3d4e5f6789012345/reset-password
Authorization: Bearer {admin_jwt_token}
```

---

#### 6. Get Metrics
```bash
GET http://localhost:5001/api/admin/metrics
Authorization: Bearer {admin_jwt_token}
```

---

### Frontend Testing

#### Test Checklist:

- [ ] **Page Load**
  - Load /dashboard/users
  - Stats hiển thị đúng
  - Danh sách users hiển thị (20 items)
  - Pagination hiển thị đúng

- [ ] **Search**
  - Nhập từ khóa → Sau 500ms auto-search
  - Kết quả đúng với keyword
  - Clear search → Show all users

- [ ] **Filters**
  - Filter "Học sinh" → Chỉ hiện students
  - Filter "Giáo viên" → Chỉ hiện teachers
  - Filter "Đã khóa" → Chỉ hiện locked users
  - Combine filters → AND logic

- [ ] **Actions**
  - Click "Xem" → Alert with userId (TODO: implement modal)
  - Click "Khóa" → Confirmation dialog → Success
  - Click "Mở khóa" → Confirmation dialog → Success
  - Click "Reset MK" → Confirmation dialog → Success → Email sent

- [ ] **Pagination**
  - Click next page → Load page 2
  - Click page number → Load correct page
  - Previous button disabled on page 1
  - Next button disabled on last page

- [ ] **Loading States**
  - Spinner hiển thị khi loading
  - Empty state hiển thị khi no results

- [ ] **Error Handling**
  - API error → Alert với error message
  - Network error → Graceful handling

---

## 🚀 Cách chạy

### 1. Start Backend:
```bash
cd backend
npm run dev
```

### 2. Start Frontend:
```bash
cd frontend
npm run dev
```

### 3. Login với Admin:
```
Email: admin@example.com
Password: admin123
```

### 4. Navigate:
```
http://localhost:3000/dashboard/users
```

---

## 📝 TODO / Future Improvements

### High Priority:
- [ ] User detail modal/page (thay vì alert)
- [ ] Bulk actions (khóa nhiều users cùng lúc)
- [ ] Export users to CSV/Excel
- [ ] Activity logs (ai làm gì, khi nào)

### Medium Priority:
- [ ] Advanced filters (created date range, last login)
- [ ] User profile editing by admin
- [ ] Role change (student → teacher)
- [ ] Email verification status

### Low Priority:
- [ ] User analytics/charts
- [ ] Custom password generator options
- [ ] Email template customization
- [ ] Notification system for locked users

---

## 🔧 Troubleshooting

### Issue 1: "Không thể tải danh sách người dùng"

**Cause:** Backend không chạy hoặc JWT token hết hạn

**Solution:**
1. Check backend đang chạy: `http://localhost:5001`
2. Check JWT token còn hạn
3. Re-login nếu cần

---

### Issue 2: Email không được gửi khi reset password

**Cause:** SMTP config chưa setup trong backend

**Solution:**
1. Check file `/backend/.env`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```
2. Restart backend

---

### Issue 3: Pagination không hoạt động

**Cause:** totalPages = 0 hoặc API không return đúng format

**Solution:**
1. Check API response có field `totalPages`
2. Check `total` và `limit` calculation
3. Check console logs

---

## 📚 API Reference Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/users` | Admin | List users with filters |
| GET | `/api/admin/users/:userId` | Admin | Get user detail |
| PUT | `/api/admin/users/:userId/status` | Admin | Update status (active/locked) |
| POST | `/api/admin/users/:userId/reset-password` | Admin | Reset password & send email |
| GET | `/api/admin/metrics` | Admin | Get system metrics |

---

## 🎨 UI Components Summary

| Component | Purpose | Props |
|-----------|---------|-------|
| UserManagementView | Main container | None |
| UserManagementTable | Display users table | users, callbacks, loading |
| UserFilterToolbar | Search & filters | query, filters, callbacks |
| UserStatsGrid | Stats cards | metrics |
| Pagination | Pagination UI | currentPage, totalPages, callback |

---

**Created:** 07/01/2026  
**Last Updated:** 07/01/2026  
**Version:** 1.0  
**Status:** ✅ Complete & Ready for Testing
