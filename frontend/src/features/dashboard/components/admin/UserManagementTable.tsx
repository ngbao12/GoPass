"use client";

import React from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { User } from "@/services/admin";

interface UserManagementTableProps {
  users: User[];
  onViewDetail: (userId: string) => void;
  onUpdateStatus: (userId: string, status: 'active' | 'locked') => void;
  onResetPassword: (userId: string) => void;
  loading?: boolean;
}

const UserManagementTable: React.FC<UserManagementTableProps> = ({
  users,
  onViewDetail,
  onUpdateStatus,
  onResetPassword,
  loading = false,
}) => {
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
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getUserAvatar = (user: User) => {
    if (user.avatar) {
      return (
        <img
          src={user.avatar}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover"
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
      <div className={`w-10 h-10 rounded-full ${colors[colorIndex]} flex items-center justify-center text-white font-semibold`}>
        {initials}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <p className="text-gray-600 mb-2 font-medium">Không tìm thấy người dùng</p>
        <p className="text-gray-500 text-sm">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người dùng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vai trò
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    {getUserAvatar(user)}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={getRoleVariant(user.role)}>
                    {getRoleLabel(user.role)}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={getStatusVariant(user.status)}>
                    {getStatusLabel(user.status)}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{formatDate(user.createdAt)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetail(user._id)}
                      icon={
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      }
                    >
                      Xem
                    </Button>
                    
                    {/* Chỉ hiển thị nút Khóa/Mở khóa cho Student và Teacher */}
                    {user.role !== 'admin' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onUpdateStatus(user._id, user.status === 'active' ? 'locked' : 'active')}
                        icon={
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            {user.status === 'active' ? (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                              />
                            ) : (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                              />
                            )}
                          </svg>
                        }
                      >
                        {user.status === 'active' ? 'Khóa' : 'Mở khóa'}
                      </Button>
                    )}
                    
                    {/* Chỉ hiển thị nút Reset MK cho Student và Teacher */}
                    {user.role !== 'admin' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onResetPassword(user._id)}
                        icon={
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
                              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                            />
                          </svg>
                        }
                      >
                        Đổi mật khẩu
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementTable;
