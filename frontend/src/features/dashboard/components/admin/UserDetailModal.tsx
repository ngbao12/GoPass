"use client";

import React, { useEffect } from "react";
import { User } from "@/services/admin";
import Badge from "@/components/ui/Badge";

interface UserDetailModalProps {
  user: User;
  onClose: () => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({ user, onClose }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const getRoleVariant = (role: User['role']) => {
    const variants: Record<User['role'], "success" | "info" | "warning"> = {
      admin: "warning",
      teacher: "info",
      student: "success",
    };
    return variants[role];
  };

  const getRoleLabel = (role: User['role']) => {
    const labels: Record<User['role'], string> = {
      admin: "Quản trị viên",
      teacher: "Giáo viên",
      student: "Học sinh",
    };
    return labels[role];
  };

  const getStatusVariant = (status: User['status']) => {
    return status === 'active' ? "success" : "danger";
  };

  const getStatusLabel = (status: User['status']) => {
    return status === 'active' ? "Hoạt động" : "Đã khóa";
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } catch (error) {
      return 'Invalid date';
    }
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
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-yellow-500'];
    const colorIndex = user._id.charCodeAt(0) % colors.length;

    return (
      <div className={`w-24 h-24 rounded-full ${colors[colorIndex]} flex items-center justify-center text-white text-3xl font-semibold`}>
        {initials}
      </div>
    );
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}
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
              <h4 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h4>
              <div className="flex items-center gap-3">
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
                <p className="text-gray-900">{user.email}</p>
              </div>
            </div>

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
                <p className="text-sm text-gray-500 font-medium">Ngày tạo tài khoản</p>
                <p className="text-gray-900">{formatDate(user.createdAt)}</p>
              </div>
            </div>

            {/* Role Description */}
            <div className="bg-gray-50 rounded-lg p-4 mt-6">
              <h5 className="font-semibold text-gray-900 mb-2">Mô tả vai trò</h5>
              <p className="text-sm text-gray-600">
                {user.role === 'admin' && 'Quản trị viên có quyền quản lý toàn bộ hệ thống, bao gồm quản lý người dùng, đề thi, và các thiết lập hệ thống.'}
                {user.role === 'teacher' && 'Giáo viên có quyền tạo và quản lý đề thi, lớp học, chấm bài và theo dõi tiến độ học sinh.'}
                {user.role === 'student' && 'Học sinh có quyền tham gia lớp học, làm bài kiểm tra, xem điểm và theo dõi kết quả học tập của mình.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
