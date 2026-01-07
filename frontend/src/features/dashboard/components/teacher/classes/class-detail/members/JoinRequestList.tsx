"use client";

import React from "react";

interface JoinRequest {
  _id: string;
  student?: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  status: string;
  requestedAt: string;
}

interface JoinRequestListProps {
  requests: JoinRequest[];
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
  actionLoading: string | null;
}

const JoinRequestList: React.FC<JoinRequestListProps> = ({ 
  requests, 
  onApprove, 
  onReject, 
  actionLoading 
}) => {
  if (requests.length === 0) {
    return null;
  }

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
      <h4 className="font-medium text-orange-900 mb-3">Yêu cầu tham gia lớp</h4>
      <div className="space-y-3">
        {requests.map((request) => (
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
                onClick={() => onApprove(request._id)}
                disabled={actionLoading === request._id}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {actionLoading === request._id ? 'Đang xử lý...' : 'Duyệt'}
              </button>
              <button
                onClick={() => onReject(request._id)}
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
  );
};

export default JoinRequestList;