"use client";

import React from "react";

interface Member {
  _id: string;
  student?: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  status: string;
  joinedDate: string;
}

interface MemberListProps {
  members: Member[];
  onRemove: (memberId: string) => void;
  onViewStats?: (member: Member) => void;
  actionLoading: string | null;
}

const MemberList: React.FC<MemberListProps> = ({ members, onRemove, onViewStats, actionLoading }) => {
  if (members.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p className="text-gray-500">Chưa có học sinh nào trong lớp</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
      {members.map((member) => (
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
            {onViewStats && (
              <button
                onClick={() => onViewStats(member)}
                className="px-3 py-1 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
              >
                Xem thống kê
              </button>
            )}
            <button
              onClick={() => onRemove(member._id)}
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
  );
};

export default MemberList;