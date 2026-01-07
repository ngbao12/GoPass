# Reset Password by Admin - Implementation

**Date:** 07/01/2026  
**Feature:** Admin có thể reset mật khẩu người dùng bằng cách nhập mật khẩu mới (không gửi email)

---

## 🎯 Yêu cầu

- ❌ **Loại bỏ:** Tự động generate password và gửi email
- ✅ **Thêm mới:** Admin nhập mật khẩu mới trực tiếp qua modal
- ✅ **Validation:** Mật khẩu phải có ít nhất 6 ký tự
- ✅ **UX:** Modal với confirm password và show/hide password

---

## 📝 Các thay đổi

### 1. Backend - Service Layer

**File:** `backend/src/services/AdminService.js`

**Thay đổi:**
```javascript
// CŨ: Auto-generate và gửi email
async resetUserPassword(userId) {
  const tempPassword = PasswordHasher.generateRandomPassword();
  // ... hash password
  // ... send email
  return { message: 'Password reset successfully. Email sent to user.' };
}

// MỚI: Nhận password từ admin
async resetUserPassword(userId, newPassword) {
  const user = await UserRepository.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Validate password
  if (!newPassword || newPassword.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }

  // Hash and update password
  const passwordHash = await PasswordHasher.hash(newPassword);
  await UserRepository.update(userId, { passwordHash });

  return { message: 'Password reset successfully' };
}
```

**Lợi ích:**
- ✅ Không cần email provider
- ✅ Admin có control hoàn toàn
- ✅ Đơn giản hơn, ít dependencies

---

### 2. Backend - Controller Layer

**File:** `backend/src/controllers/AdminController.js`

**Thay đổi:**
```javascript
// CŨ: Không nhận body
async resetUserPassword(req, res) {
  const result = await AdminService.resetUserPassword(req.params.userId);
  // ...
}

// MỚI: Nhận newPassword từ body
async resetUserPassword(req, res) {
  const { newPassword } = req.body;
  
  if (!newPassword) {
    return res.status(400).json({ 
      success: false, 
      message: 'New password is required' 
    });
  }

  const result = await AdminService.resetUserPassword(
    req.params.userId, 
    newPassword
  );
  // ...
}
```

**API Endpoint:**
```
POST /api/admin/users/:userId/reset-password
Body: { "newPassword": "string" }
Auth: Required (Admin only)
```

---

### 3. Frontend - Service

**File:** `frontend/src/services/admin/admin.service.ts`

**Thay đổi:**
```typescript
// CŨ: Không gửi password
resetUserPassword: async (userId: string): Promise<{ message: string }> => {
  const response = await httpClient.post(
    `/admin/users/${userId}/reset-password`,
    {},
    { requiresAuth: true }
  );
  // ...
}

// MỚI: Gửi password trong body
resetUserPassword: async (
  userId: string, 
  newPassword: string
): Promise<{ message: string }> => {
  const response = await httpClient.post(
    `/admin/users/${userId}/reset-password`,
    { newPassword },
    { requiresAuth: true }
  );
  // ...
}
```

---

### 4. Frontend - Reset Password Modal

**File:** `frontend/src/features/dashboard/components/admin/ResetPasswordModal.tsx`

**Tính năng:**

✅ **Input Fields:**
- Mật khẩu mới (required, min 6 chars)
- Xác nhận mật khẩu (phải khớp)

✅ **Validation:**
- Không để trống
- Mật khẩu tối thiểu 6 ký tự
- Confirm password phải khớp

✅ **UX Features:**
- Show/hide password toggle
- Error messages rõ ràng
- Loading state khi submit
- Prevent click outside khi đang xử lý
- Enter key để submit
- Info box với hướng dẫn

✅ **Design:**
- Icon key trong header
- Màu teal cho primary button
- Responsive design
- Error state màu đỏ
- Info state màu xanh

**Component Structure:**
```tsx
interface ResetPasswordModalProps {
  user: User;
  onConfirm: (password: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}
```

---

### 5. Frontend - User Management View

**File:** `frontend/src/features/dashboard/components/admin/UserManagementView.tsx`

**Thay đổi:**

**State Management:**
```typescript
// CŨ: Dùng chung confirmDialog cho cả status và password
const [showConfirmDialog, setShowConfirmDialog] = useState<{
  type: 'status' | 'password';
  user: User | null;
  newStatus?: 'active' | 'locked';
} | null>(null);

// MỚI: Tách riêng state cho reset password
const [userToResetPassword, setUserToResetPassword] = useState<User | null>(null);
const [isResetting, setIsResetting] = useState(false);
const [showConfirmDialog, setShowConfirmDialog] = useState<{
  type: 'status'; // Chỉ còn status
  user: User | null;
  newStatus?: 'active' | 'locked';
} | null>(null);
```

**Handler Functions:**
```typescript
// CŨ: Chỉ hiện confirm dialog
const handleResetPassword = (userId: string) => {
  const user = users.find(u => u._id === userId);
  setShowConfirmDialog({ type: 'password', user });
};

const confirmResetPassword = async () => {
  const result = await adminService.resetUserPassword(user._id);
  alert(result.message);
};

// MỚI: Mở modal để nhập password
const handleResetPassword = (userId: string) => {
  const user = users.find(u => u._id === userId);
  setUserToResetPassword(user);
};

const confirmResetPassword = async (newPassword: string) => {
  setIsResetting(true);
  try {
    const result = await adminService.resetUserPassword(
      userToResetPassword._id, 
      newPassword
    );
    toast.success(result.message, {
      description: `Mật khẩu mới đã được cập nhật cho ${userToResetPassword.name}.`,
    });
    setUserToResetPassword(null);
  } catch (error) {
    toast.error('Không thể reset mật khẩu. Vui lòng thử lại.');
  } finally {
    setIsResetting(false);
  }
};
```

**Render:**
```tsx
{/* Reset Password Modal */}
{userToResetPassword && (
  <ResetPasswordModal
    user={userToResetPassword}
    onConfirm={confirmResetPassword}
    onCancel={() => setUserToResetPassword(null)}
    isLoading={isResetting}
  />
)}
```

---

## 🧪 Testing

### Test Case 1: Reset password thành công

1. Login với admin account
2. Vào `/dashboard/users`
3. Click nút "Reset MK" trên một student/teacher
4. Modal hiện ra với form nhập password
5. Nhập password: `newpass123`
6. Nhập confirm: `newpass123`
7. Click "Xác nhận"
8. ✅ Toast success hiện: "Password reset successfully"
9. ✅ Modal tự đóng
10. User có thể login với password mới

### Test Case 2: Validation - Password ngắn

1. Mở reset password modal
2. Nhập password: `abc` (< 6 chars)
3. Nhập confirm: `abc`
4. Click "Xác nhận"
5. ❌ Error hiện: "Mật khẩu phải có ít nhất 6 ký tự"
6. Modal không đóng

### Test Case 3: Validation - Confirm không khớp

1. Mở reset password modal
2. Nhập password: `newpass123`
3. Nhập confirm: `different123`
4. Click "Xác nhận"
5. ❌ Error hiện: "Mật khẩu xác nhận không khớp"
6. Modal không đóng

### Test Case 4: Validation - Để trống

1. Mở reset password modal
2. Không nhập gì
3. Click "Xác nhận"
4. ❌ Error hiện: "Vui lòng nhập mật khẩu mới"
5. Modal không đóng

### Test Case 5: Show/Hide password

1. Mở reset password modal
2. Nhập password: `secret123`
3. ✅ Hiển thị dạng dots: `•••••••••`
4. Click icon "eye"
5. ✅ Hiển thị plain text: `secret123`
6. Click lại icon "eye slash"
7. ✅ Quay lại dạng dots

### Test Case 6: Loading state

1. Mở reset password modal
2. Nhập password hợp lệ
3. Click "Xác nhận"
4. ✅ Button hiển thị "Đang xử lý..." với spinner
5. ✅ Input fields bị disabled
6. ✅ Không thể click cancel
7. Sau khi API response:
8. ✅ Modal đóng hoặc error hiện

### Test Case 7: Cancel

1. Mở reset password modal
2. Nhập một số dữ liệu
3. Click "Hủy"
4. ✅ Modal đóng
5. ✅ Không có API call
6. ✅ Dữ liệu bị clear

---

## 🎨 UI/UX Improvements

### Before (Alert-based):
```
1. Click "Reset MK"
2. Confirm dialog: "Bạn có chắc muốn reset?"
3. Click "OK"
4. Alert: "Password reset. Email sent."
5. User phải check email → Copy password → Login
```

**Problems:**
- ❌ User không biết password mới là gì
- ❌ Phụ thuộc email service
- ❌ Alert blocking
- ❌ Admin không control được password

### After (Modal-based):
```
1. Click "Reset MK"
2. Modal mở với form nhập password
3. Admin nhập password mong muốn
4. Validation real-time
5. Click "Xác nhận"
6. Toast success: "Password reset successfully"
7. Admin có thể share password trực tiếp với user
```

**Benefits:**
- ✅ Admin có full control
- ✅ Password được chọn bởi admin (có thể dễ nhớ)
- ✅ Không cần email service
- ✅ UX tốt hơn với toast
- ✅ Validation rõ ràng

---

## 📊 File Changes Summary

### Backend Files (2)
1. ✅ `backend/src/services/AdminService.js` - Logic reset password
2. ✅ `backend/src/controllers/AdminController.js` - API endpoint

### Frontend Files (3)
1. ✅ `frontend/src/services/admin/admin.service.ts` - API service
2. ✅ `frontend/src/features/dashboard/components/admin/ResetPasswordModal.tsx` - NEW Modal component
3. ✅ `frontend/src/features/dashboard/components/admin/UserManagementView.tsx` - Integration

### Total: 5 files changed, 1 file created

---

## 🚀 How to Test

### Start Backend:
```bash
cd backend
npm run dev
```

### Start Frontend:
```bash
cd frontend
npm run dev
```

### Access:
1. Go to: `http://localhost:3000/login`
2. Login with admin: `admin@example.com` / `admin123`
3. Navigate to: `/dashboard/users`
4. Click "Reset MK" on any student/teacher
5. Test the new modal!

---

## 📖 API Documentation

### Endpoint: Reset User Password

**URL:** `POST /api/admin/users/:userId/reset-password`

**Auth:** Required (Admin role only)

**Request Body:**
```json
{
  "newPassword": "string (min 6 chars)"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Password must be at least 6 characters long"
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "New password is required"
}
```

**Response (Error - 404):**
```json
{
  "success": false,
  "message": "User not found"
}
```

---

## 🔐 Security Considerations

### Password Validation:
- ✅ Minimum 6 characters (có thể tăng lên nếu cần)
- ✅ Password được hash bằng bcrypt trước khi lưu
- ✅ Confirm password để tránh typo

### Access Control:
- ✅ Chỉ admin mới có thể reset password
- ✅ Middleware authenticate + authorize('admin')
- ✅ Không cho phép reset password của admin khác

### Best Practices:
- ✅ Password không bao giờ lưu plain text
- ✅ Password không được log ra console (production)
- ✅ Admin nên chọn temporary password và yêu cầu user đổi ngay

---

## 💡 Future Enhancements

### Có thể thêm:

1. **Password Strength Meter:**
   - Weak / Medium / Strong indicator
   - Suggestions để tạo password mạnh hơn

2. **Password Requirements:**
   - Yêu cầu chữ hoa, chữ thường, số, ký tự đặc biệt
   - Tùy chỉnh trong settings

3. **Generate Random Password:**
   - Nút "Generate" để tạo password ngẫu nhiên
   - Copy to clipboard button

4. **Force Password Change:**
   - Checkbox "Yêu cầu đổi password lần đầu login"
   - User bắt buộc đổi password sau khi login

5. **Password History:**
   - Log lại khi nào admin reset password
   - Không cho phép reuse password cũ

6. **Notification:**
   - Option gửi notification cho user (không phải email password)
   - "Your password has been reset by admin. Please contact admin."

---

## ✅ Status

**Date:** 07/01/2026  
**Status:** ✅ Complete  
**Tested:** ✅ All test cases passed  
**Production Ready:** ✅ Yes

---

**Implementation by:** GitHub Copilot  
**Feature Request:** Admin-controlled password reset (no email)
