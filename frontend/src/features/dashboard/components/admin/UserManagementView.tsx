"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import SectionHeader from "@/components/ui/SectionHeader";
import { adminService, User, SystemMetrics } from "@/services/admin";
import UserStatsGrid from "./UserStatsGrid";
import UserFilterToolbar from "./UserFilterToolbar";
import UserManagementTable from "./UserManagementTable";
import Pagination from "./Pagination";
import UserDetailModal from "./UserDetailModal";
import ResetPasswordModal from "./ResetPasswordModal";

const UserManagementView: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalUsers: 0,
    activeUsers: 0,
    students: 0,
    teachers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<'all' | User['role']>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | User['status']>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToResetPassword, setUserToResetPassword] = useState<User | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<{
    type: 'status';
    user: User | null;
    newStatus?: 'active' | 'locked';
  } | null>(null);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: 20,
      };

      if (roleFilter !== 'all') params.role = roleFilter;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (searchQuery.trim()) params.keyword = searchQuery.trim();

      const response = await adminService.listUsers(params);
      setUsers(response.users);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Không thể tải danh sách người dùng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch metrics
  const fetchMetrics = async () => {
    try {
      const data = await adminService.getSystemMetrics();
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  // Initial load
  useEffect(() => {
    fetchMetrics();
  }, []);

  // Reload when filters change
  useEffect(() => {
    fetchUsers();
  }, [currentPage, roleFilter, statusFilter]);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1); // Reset to first page on search
      fetchUsers();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleViewDetail = (userId: string) => {
    const user = users.find(u => u._id === userId);
    if (user) {
      setSelectedUser(user);
    }
  };

  const handleUpdateStatus = (userId: string, newStatus: 'active' | 'locked') => {
    const user = users.find(u => u._id === userId);
    if (!user) return;

    setShowConfirmDialog({
      type: 'status',
      user,
      newStatus,
    });
  };

  const handleResetPassword = (userId: string) => {
    const user = users.find(u => u._id === userId);
    if (!user) return;

    setUserToResetPassword(user);
  };

  const confirmUpdateStatus = async () => {
    if (!showConfirmDialog || showConfirmDialog.type !== 'status' || !showConfirmDialog.user) return;

    try {
      await adminService.updateUserStatus(
        showConfirmDialog.user._id,
        showConfirmDialog.newStatus!
      );

      // Update local state
      setUsers(users.map(u =>
        u._id === showConfirmDialog.user!._id
          ? { ...u, status: showConfirmDialog.newStatus! }
          : u
      ));

      // Refresh metrics
      fetchMetrics();

      toast.success(
        `Đã ${showConfirmDialog.newStatus === 'active' ? 'mở khóa' : 'khóa'} tài khoản thành công!`
      );
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Không thể cập nhật trạng thái. Vui lòng thử lại.');
    } finally {
      setShowConfirmDialog(null);
    }
  };

  const confirmResetPassword = async (newPassword: string) => {
    if (!userToResetPassword) return;

    setIsResetting(true);
    try {
      const result = await adminService.resetUserPassword(userToResetPassword._id, newPassword);
      toast.success(result.message, {
        description: `Mật khẩu mới đã được cập nhật cho ${userToResetPassword.name}.`,
      });
      setUserToResetPassword(null);
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Không thể reset mật khẩu. Vui lòng thử lại.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <SectionHeader
        title="Quản lý người dùng"
        subtitle={`Quản lý tất cả người dùng trong hệ thống - Tổng cộng ${metrics.totalUsers} người dùng`}
      />

      {/* Stats Grid */}
      <UserStatsGrid metrics={metrics} />

      {/* Filter Toolbar */}
      <UserFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* User Table */}
      <UserManagementTable
        users={users}
        onViewDetail={handleViewDetail}
        onUpdateStatus={handleUpdateStatus}
        onResetPassword={handleResetPassword}
        loading={loading}
      />

      {/* Pagination */}
      {!loading && users.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {/* Reset Password Modal */}
      {userToResetPassword && (
        <ResetPasswordModal
          user={userToResetPassword}
          onConfirm={confirmResetPassword}
          onCancel={() => setUserToResetPassword(null)}
          isLoading={isResetting}
        />
      )}

      {/* Status Confirmation Dialog */}
      {showConfirmDialog && showConfirmDialog.type === 'status' && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Xác nhận thay đổi trạng thái
            </h3>
            
            <div className="mb-6">
              <p className="text-gray-600">
                Bạn có chắc chắn muốn {showConfirmDialog.newStatus === 'active' ? 'mở khóa' : 'khóa'} tài khoản{' '}
                <strong>{showConfirmDialog.user?.name}</strong>?
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmDialog(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmUpdateStatus}
                className="px-4 py-2 text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementView;
