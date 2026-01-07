"use client";

import React, { useState, useEffect, useCallback } from "react";
import { classApi } from "@/services/teacher";
import type { ClassDetail } from "@/services/teacher/types";
import JoinRequestList from "./JoinRequestList";
import MemberList from "./MemberList";

interface ClassMembersViewProps {
  classDetail: ClassDetail;
  onUpdate: () => void;
}

const ClassMembersView: React.FC<ClassMembersViewProps> = ({ classDetail, onUpdate }) => {
  const [members, setMembers] = useState<any[]>([]);
  const [joinRequests, setJoinRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadMembersData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch members and join requests in parallel
      const [membersRes, requestsRes] = await Promise.all([
        classApi.getClassMembers(classDetail.id),
        classApi.getJoinRequests(classDetail.id)
      ]);
      
      if (membersRes.success) {
        setMembers((membersRes.data as any)?.members || []);
      }
      
      if (requestsRes.success) {
        setJoinRequests((requestsRes.data as any)?.requests || []);
      }
    } catch (error) {
      console.error('Error loading members data:', error);
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
      const response = await classApi.approveJoinRequest(classDetail.id, requestId);
      
      if (response.success) {
        // Reload data and notify parent
        await loadMembersData();
        onUpdate();
      } else {
        alert(response.error || 'Không thể duyệt yêu cầu');
      }
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Đã xảy ra lỗi khi duyệt yêu cầu');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      setActionLoading(requestId);
      const response = await classApi.rejectJoinRequest(classDetail.id, requestId);
      
      if (response.success) {
        // Reload data
        await loadMembersData();
        onUpdate();
      } else {
        alert(response.error || 'Không thể từ chối yêu cầu');
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Đã xảy ra lỗi khi từ chối yêu cầu');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Bạn có chắc muốn xóa học sinh này khỏi lớp?')) {
      return;
    }
    
    try {
      setActionLoading(memberId);
      const response = await classApi.removeMember(classDetail.id, memberId);
      
      if (response.success) {
        // Reload data
        await loadMembersData();
        onUpdate();
      } else {
        alert(response.error || 'Không thể xóa học sinh');
      }
    } catch (error) {
      console.error('Error removing member:', error);
      alert('Đã xảy ra lỗi khi xóa học sinh');
    } finally {
      setActionLoading(null);
    }
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
    <div className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Quản lý thành viên</h3>
            <p className="text-sm text-gray-600">Duyệt yêu cầu tham gia và quản lý học sinh trong lớp</p>
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
          <h4 className="font-medium text-gray-900 mb-4">Thành viên lớp học</h4>
          <MemberList
            members={members}
            onRemove={handleRemoveMember}
            actionLoading={actionLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default ClassMembersView;