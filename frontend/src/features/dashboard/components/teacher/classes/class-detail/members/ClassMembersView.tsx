"use client";

import React, { useState, useEffect, useCallback } from "react";
import { classApi } from "@/services/teacher";
import type { ClassDetail } from "@/services/teacher/types";

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
        {joinRequests.length > 0 ? (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="font-medium text-orange-900 mb-3">Yêu cầu tham gia lớp</h4>
            <div className="space-y-3">
              {joinRequests.map((request: any) => (
                <div key={request._id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-medium text-sm">
                        {request.student?.name?.charAt(0) || '?'}
                      </span>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">{request.student?.name || 'Unknown'}</h5>
                      <p className="text-sm text-gray-600">{request.student?.email || ''}</p>
                      <p className="text-xs text-gray-500">
                        Yêu cầu lúc: {new Date(request.requestedAt).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApproveRequest(request._id)}
                      disabled={actionLoading === request._id}
                      className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {actionLoading === request._id ? 'Đang xử lý...' : 'Duyệt'}
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request._id)}
                      disabled={actionLoading === request._id}
                      className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {actionLoading === request._id ? 'Đang xử lý...' : 'Từ chối'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Current Members */}
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Thành viên lớp học</h4>
          {members.length > 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
              {members.map((member: any) => (
                <div key={member._id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                      <span className="text-teal-600 font-medium text-sm">
                        {member.student?.name?.charAt(0) || '?'}
                      </span>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">{member.student?.name || 'Unknown'}</h5>
                      <p className="text-sm text-gray-600">{member.student?.email || ''}</p>
                      <p className="text-xs text-gray-500">
                        Tham gia: {new Date(member.joinedDate).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      member.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {member.status === 'active' ? 'Hoạt động' : member.status}
                    </span>
                    <button
                      onClick={() => handleRemoveMember(member._id)}
                      disabled={actionLoading === member._id}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-500">Chưa có học sinh nào trong lớp</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassMembersView;