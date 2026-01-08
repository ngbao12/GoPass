"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { classApi } from "@/services/teacher";
import type { ClassDetail } from "@/services/teacher/types";
import JoinRequestList from "./JoinRequestList";
import MemberList from "./MemberList";
import NotificationModal from "@/components/ui/NotificationModal";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface ClassMembersViewProps {
  classDetail: ClassDetail;
  onUpdate: () => void;
}

const ClassMembersView: React.FC<ClassMembersViewProps> = ({
  classDetail,
  onUpdate,
}) => {
  const router = useRouter();
  const [members, setMembers] = useState<any[]>([]);
  const [joinRequests, setJoinRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [memberStats, setMemberStats] = useState<any | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error" | "warning" | "info";
  }>({ isOpen: false, message: "", type: "info" });
  const [confirm, setConfirm] = useState<{
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    type: "danger" | "warning" | "info";
  }>({ isOpen: false, message: "", onConfirm: () => {}, type: "warning" });

  const loadMembersData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch members and join requests in parallel
      const [membersRes, requestsRes] = await Promise.all([
        classApi.getClassMembers(classDetail.id),
        classApi.getJoinRequests(classDetail.id),
      ]);

      if (membersRes.success) {
        setMembers((membersRes.data as any)?.members || []);
      }

      if (requestsRes.success) {
        setJoinRequests((requestsRes.data as any)?.requests || []);
      }
    } catch (error) {
      console.error("Error loading members data:", error);
    } finally {
      setLoading(false);
    }
  }, [classDetail.id]);

  useEffect(() => {
    loadMembersData();
  }, [loadMembersData]);

  const handleApproveRequest = async (requestId: string) => {
    try {
      setActionLoading(requestId);
      const response = await classApi.approveJoinRequest(
        classDetail.id,
        requestId
      );

      if (response.success) {
        // Reload data and notify parent
        await loadMembersData();
        onUpdate();
      } else {
        setNotification({
          isOpen: true,
          message: response.error || "Không thể duyệt yêu cầu",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error approving request:", error);
      setNotification({
        isOpen: true,
        message: "Đã xảy ra lỗi khi duyệt yêu cầu",
        type: "error",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      setActionLoading(requestId);
      const response = await classApi.rejectJoinRequest(
        classDetail.id,
        requestId
      );

      if (response.success) {
        // Reload data
        await loadMembersData();
        onUpdate();
      } else {
        setNotification({
          isOpen: true,
          message: response.error || "Không thể từ chối yêu cầu",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      setNotification({
        isOpen: true,
        message: "Đã xảy ra lỗi khi từ chối yêu cầu",
        type: "error",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    setConfirm({
      isOpen: true,
      message: "Bạn có chắc muốn xóa học sinh này khỏi lớp?",
      type: "danger",
      onConfirm: async () => {
        try {
          setActionLoading(memberId);
          const response = await classApi.removeMember(
            classDetail.id,
            memberId
          );

          if (response.success) {
            // Reload data
            await loadMembersData();
            onUpdate();
          } else {
            setNotification({
              isOpen: true,
              message: response.error || "Không thể xóa học sinh",
              type: "error",
            });
          }
        } catch (error) {
          console.error("Error removing member:", error);
          setNotification({
            isOpen: true,
            message: "Đã xảy ra lỗi khi xóa học sinh",
            type: "error",
          });
        } finally {
          setActionLoading(null);
        }
      },
    });
  };

  const handleViewStats = async (member: any) => {
    try {
      setSelectedMember(member);
      setStatsLoading(true);
      const studentId = member.student?._id || member._id;
      const response = await classApi.getStudentStats(
        classDetail.id,
        studentId
      );
      if (response?.success) {
        setMemberStats(response.data);
      } else {
        setMemberStats(null);
      }
    } catch (error) {
      console.error("Error loading student stats:", error);
      setMemberStats(null);
    } finally {
      setStatsLoading(false);
    }
  };

  const closeStatsModal = () => {
    setSelectedMember(null);
    setMemberStats(null);
    setStatsLoading(false);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Quản lý thành viên
              </h3>
              <p className="text-sm text-gray-600">
                Duyệt yêu cầu tham gia và quản lý học sinh trong lớp
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                {members.length} thành viên
              </span>
              {joinRequests.length > 0 && (
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                  {joinRequests.length} yêu cầu chờ duyệt
                </span>
              )}
            </div>
          </div>

          {/* Join Requests */}
          <JoinRequestList
            requests={joinRequests}
            onApprove={handleApproveRequest}
            onReject={handleRejectRequest}
            actionLoading={actionLoading}
          />

          {/* Current Members */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">
              Thành viên lớp học
            </h4>
            <MemberList
              members={members}
              onRemove={handleRemoveMember}
              onViewStats={handleViewStats}
              actionLoading={actionLoading}
            />
          </div>
        </div>
      </div>

      {selectedMember && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  Thống kê học sinh
                </h4>
                <p className="text-sm text-gray-600">
                  {selectedMember.student?.name || "Học sinh"}
                </p>
              </div>
              <button
                onClick={closeStatsModal}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-5 h-5"
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

            <div className="px-6 py-4 space-y-4">
              {statsLoading ? (
                <div className="py-8 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                </div>
              ) : memberStats ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-teal-50 rounded-lg p-3">
                      <p className="text-sm text-teal-700">Đã làm</p>
                      <p className="text-xl font-semibold text-teal-800">
                        {memberStats.completedAssignments}/
                        {memberStats.totalAssignments}
                      </p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-3">
                      <p className="text-sm text-amber-700">Chưa làm</p>
                      <p className="text-xl font-semibold text-amber-800">
                        {Math.max(
                          (memberStats.totalAssignments || 0) -
                            (memberStats.completedAssignments || 0),
                          0
                        )}
                        /{memberStats.totalAssignments}
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <p className="text-sm text-purple-700">Điểm trung bình</p>
                      <p className="text-xl font-semibold text-purple-800">
                        {memberStats.averageScore ?? 0}
                      </p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm text-blue-700">Tổng bài</p>
                      <p className="text-xl font-semibold text-blue-800">
                        {memberStats.totalAssignments || 0}
                      </p>
                    </div>
                  </div>

                  {Array.isArray(memberStats.recentResults) &&
                  memberStats.recentResults.length > 0 ? (
                    <div className="border border-gray-200 rounded-lg">
                      <div className="px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                        <p className="font-medium text-gray-900">
                          Bài làm gần đây
                        </p>
                        <span className="text-xs text-gray-500">
                          {memberStats.recentResults.length} bài
                        </span>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {memberStats.recentResults.map((item: any) => {
                          const submittedDate = item.submittedAt
                            ? new Date(item.submittedAt).toLocaleString(
                                "vi-VN",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  day: "2-digit",
                                  month: "2-digit",
                                }
                              )
                            : null;
                          return (
                            <button
                              key={item.assignmentId}
                              onClick={() =>
                                item.submissionId &&
                                router.push(
                                  `/dashboard/grading/${item.submissionId}`
                                )
                              }
                              className="w-full text-left px-4 py-3 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">
                                  {item.title || "Bài tập"}
                                </p>
                                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                  <span className="px-2 py-0.5 bg-gray-100 rounded-full text-gray-700">
                                    {item.assignmentId?.slice(-6) || "N/A"}
                                  </span>
                                  <span>{submittedDate || "Chưa nộp"}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-lg">
                                  {item.score ?? 0}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      Chưa có dữ liệu bài làm gần đây
                    </div>
                  )}
                </>
              ) : (
                <div className="text-sm text-gray-500">
                  Không thể tải thống kê
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClassMembersView;
