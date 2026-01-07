# Update: Conditional Action Buttons trong User Management

## 📝 Thay đổi

### File: `UserManagementTable.tsx`

**Trước đây:** 
- Tất cả users (admin, teacher, student) đều hiển thị 3 nút: Xem, Khóa/Mở khóa, Reset MK

**Bây giờ:**
- **Admin users**: Chỉ hiển thị nút "Xem"
- **Teacher & Student users**: Hiển thị đầy đủ 3 nút: Xem, Khóa/Mở khóa, Reset MK

---

## 🔒 Logic mới

```tsx
// Nút "Xem" - Luôn hiển thị cho tất cả
<Button onClick={() => onViewDetail(user._id)}>
  Xem
</Button>

// Nút "Khóa/Mở khóa" - Chỉ hiển thị khi KHÔNG phải admin
{user.role !== 'admin' && (
  <Button onClick={() => onUpdateStatus(...)}>
    {user.status === 'active' ? 'Khóa' : 'Mở khóa'}
  </Button>
)}

// Nút "Reset MK" - Chỉ hiển thị khi KHÔNG phải admin
{user.role !== 'admin' && (
  <Button onClick={() => onResetPassword(...)}>
    Reset MK
  </Button>
)}
```

---

## 🎯 Kết quả

### Khi xem danh sách users:

**Admin account** (role: admin):
```
| Avatar | Name       | Email           | Role          | Status    | Actions |
|--------|------------|-----------------|---------------|-----------|---------|
| 👤     | Admin User | admin@email.com | Quản trị viên | Hoạt động | [Xem]   |
```

**Teacher account** (role: teacher):
```
| Avatar | Name         | Email             | Role      | Status    | Actions                     |
|--------|--------------|-------------------|-----------|-----------|------------------------------|
| 👤     | Teacher User | teacher@email.com | Giáo viên | Hoạt động | [Xem] [Khóa] [Reset MK]    |
```

**Student account** (role: student):
```
| Avatar | Name         | Email             | Role      | Status    | Actions                     |
|--------|--------------|-------------------|-----------|-----------|------------------------------|
| 👤     | Student User | student@email.com | Học sinh  | Hoạt động | [Xem] [Khóa] [Reset MK]    |
```

---

## 🛡️ Security reasoning

**Tại sao ẩn 2 nút này cho admin?**

1. **Khóa tài khoản admin**: 
   - Nguy hiểm vì có thể khóa chính mình hoặc admin khác
   - Admin nên được quản lý bởi super admin hoặc qua database trực tiếp
   
2. **Reset password admin**:
   - Rủi ro bảo mật cao nếu reset password admin khác
   - Admin nên tự reset password qua "Forgot Password" flow
   
3. **Best practice**:
   - Admin không nên có quyền modify admin khác
   - Tránh trường hợp admin rogue lock tất cả admin khác

---

## ✅ Testing

### Test case 1: Xem admin user
1. Login với admin account
2. Vào `/dashboard/users`
3. Tìm user có role = "Quản trị viên"
4. ✅ Chỉ thấy nút "Xem"
5. ❌ KHÔNG thấy nút "Khóa" và "Reset MK"

### Test case 2: Xem teacher user
1. Tìm user có role = "Giáo viên"
2. ✅ Thấy cả 3 nút: Xem, Khóa, Reset MK
3. ✅ Click "Khóa" → Confirm → Success
4. ✅ Click "Reset MK" → Confirm → Email sent

### Test case 3: Xem student user
1. Tìm user có role = "Học sinh"
2. ✅ Thấy cả 3 nút: Xem, Khóa, Reset MK
3. ✅ Các actions hoạt động bình thường

---

## 📊 UI Changes

### Before:
```
Admin User     [Xem] [Khóa] [Reset MK]  ← Nguy hiểm!
Teacher User   [Xem] [Khóa] [Reset MK]
Student User   [Xem] [Khóa] [Reset MK]
```

### After:
```
Admin User     [Xem]                    ← An toàn hơn
Teacher User   [Xem] [Khóa] [Reset MK]
Student User   [Xem] [Khóa] [Reset MK]
```

---

## 🔄 Alternative approach (nếu cần)

Nếu muốn admin có thể manage admin khác, có thể:

**Option 1: Super Admin**
```tsx
// Chỉ super admin mới có thể lock admin
{(user.role !== 'admin' || currentUser.isSuperAdmin) && (
  <Button>Khóa</Button>
)}
```

**Option 2: Prevent self-lock**
```tsx
// Không cho phép lock chính mình
{user._id !== currentUserId && (
  <Button>Khóa</Button>
)}
```

**Option 3: Confirmation với warning**
```tsx
// Warning đặc biệt khi lock admin
if (user.role === 'admin') {
  alert('⚠️ Cảnh báo: Bạn đang khóa tài khoản admin!');
}
```

---

## 📝 Code diff

```diff
  <Button onClick={() => onViewDetail(user._id)}>
    Xem
  </Button>
  
+ {/* Chỉ hiển thị cho Student và Teacher */}
+ {user.role !== 'admin' && (
    <Button onClick={() => onUpdateStatus(...)}>
      {user.status === 'active' ? 'Khóa' : 'Mở khóa'}
    </Button>
+ )}

+ {/* Chỉ hiển thị cho Student và Teacher */}
+ {user.role !== 'admin' && (
    <Button onClick={() => onResetPassword(...)}>
      Reset MK
    </Button>
+ )}
```

---

**Date:** 07/01/2026  
**Status:** ✅ Complete  
**Security:** ✅ Improved
