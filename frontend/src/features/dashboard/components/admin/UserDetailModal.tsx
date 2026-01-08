"use client";

import React, { useEffect, useState } from "react";
import { User, adminService } from "@/services/admin";
import Badge from "@/components/ui/Badge";
import { toast } from "sonner";
import { formatDateTimeVN } from "@/utils/format-date";

interface UserDetailModalProps {
  user: User;
  onClose: () => void;
  onUpdate?: (updatedUser: User) => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({
  user,
  onClose,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
  });

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Reset edited user when user prop changes
  useEffect(() => {
    setEditedUser({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  }, [user]);

  // Reset edited user when user prop changes
  useEffect(() => {
    setEditedUser({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  }, [user]);

  const getRoleVariant = (role: User["role"]) => {
    const variants: Record<User["role"], "success" | "info" | "warning"> = {
      admin: "warning",
      teacher: "info",
      student: "success",
    };
    return variants[role];
  };

  const getRoleLabel = (role: User["role"]) => {
    const labels: Record<User["role"], string> = {
      admin: "Quản trị viên",
      teacher: "Giáo viên",
      student: "Học sinh",
    };
    return labels[role];
  };

  const getStatusVariant = (status: User["status"]) => {
    return status === "active" ? "success" : "danger";
  };

  const getStatusLabel = (status: User["status"]) => {
    return status === "active" ? "Hoạt động" : "Đã khóa";
  };

  const getUserAvatar = () => {
    if (user.avatar) {
      return (
        <img
          src={user.avatar}
          alt={user.name}
          className="w-24 h-24 rounded-full object-cover"
        />
      );
    }

    // Generate avatar from initials
    const initials = user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-yellow-500",
    ];
    const colorIndex = user._id.charCodeAt(0) % colors.length;

    return (
      <div
        className={`w-24 h-24 rounded-full ${colors[colorIndex]} flex items-center justify-center text-white text-3xl font-semibold`}
      >
        {initials}
      </div>
    );
  };

  const handleSave = async () => {
    // Validate
    if (!editedUser.name.trim()) {
      toast.error("Tên không được để trống");
      return;
    }

    if (
      !editedUser.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedUser.email)
    ) {
      toast.error("Email không hợp lệ");
      return;
    }

    // Check if anything changed
    if (
      editedUser.name === user.name &&
      editedUser.email === user.email &&
      editedUser.role === user.role
    ) {
      toast.info("Không có thay đổi nào");
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      const updatedUser = await adminService.updateUserInfo(
        user._id,
        editedUser
      );
      toast.success("Cập nhật thông tin thành công");
      setIsEditing(false);

      // Call onUpdate callback if provided
      if (onUpdate) {
        onUpdate(updatedUser);
      }
    } catch (error: any) {
      toast.error(error.message || "Cập nhật thất bại");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedUser({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setIsEditing(false);
  };

  // Don't allow editing admin users (except for teachers and students)
  const canEdit = user.role === "teacher" || user.role === "student";

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.25)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Thông tin người dùng
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Avatar & Basic Info */}
          <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200">
            {getUserAvatar()}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên
                    </label>
                    <input
                      type="text"
                      value={editedUser.name}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Nhập tên người dùng"
                    />
                  </div>
                </div>
              ) : (
                <h4 className="text-2xl font-bold text-gray-900 mb-2">
                  {user.name}
                </h4>
              )}
              <div className="flex items-center gap-3 mt-2">
                <Badge variant={getRoleVariant(user.role)}>
                  {getRoleLabel(user.role)}
                </Badge>
                <Badge variant={getStatusVariant(user.status)}>
                  {getStatusLabel(user.status)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Detailed Info */}
          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-start gap-3">
              <div className="bg-teal-50 p-2 rounded-lg">
                <svg
                  className="w-5 h-5 text-teal-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 font-medium">Email</p>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedUser.email}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 mt-1"
                    placeholder="Nhập email"
                  />
                ) : (
                  <p className="text-gray-900">{user.email}</p>
                )}
              </div>
            </div>

            {/* Role - only editable if teacher or student */}
            {canEdit && (
              <div className="flex items-start gap-3">
                <div className="bg-purple-50 p-2 rounded-lg">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-medium">Vai trò</p>
                  {isEditing ? (
                    <select
                      value={editedUser.role}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          role: e.target.value as User["role"],
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 mt-1"
                    >
                      <option value="teacher">Giáo viên</option>
                      <option value="student">Học sinh</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{getRoleLabel(user.role)}</p>
                  )}
                </div>
              </div>
            )}

            {/* Created At */}
            <div className="flex items-start gap-3">
              <div className="bg-blue-50 p-2 rounded-lg">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 font-medium">
                  Ngày tạo tài khoản
                </p>
                <p className="text-gray-900">
                  {formatDateTimeVN(user.createdAt)}
                </p>
              </div>
            </div>

            {/* Role Description */}
            <div className="bg-gray-50 rounded-lg p-4 mt-6">
              <h5 className="font-semibold text-gray-900 mb-2">
                Mô tả vai trò
              </h5>
              <p className="text-sm text-gray-600">
                {user.role === "admin" &&
                  "Quản trị viên có quyền quản lý toàn bộ hệ thống, bao gồm quản lý người dùng, đề thi, và các thiết lập hệ thống."}
                {user.role === "teacher" &&
                  "Giáo viên có quyền tạo và quản lý đề thi, lớp học, chấm bài và theo dõi tiến độ học sinh."}
                {user.role === "student" &&
                  "Học sinh có quyền tham gia lớp học, làm bài kiểm tra, xem điểm và theo dõi kết quả học tập của mình."}
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Lưu
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                {canEdit && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-teal-600 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Chỉnh sửa
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Đóng
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
