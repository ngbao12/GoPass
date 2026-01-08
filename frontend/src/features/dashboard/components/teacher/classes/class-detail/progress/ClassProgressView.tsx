"use client";

import React, { useState, useEffect } from "react";
import { classApi } from "@/services/teacher";
import type { ClassDetail } from "@/services/teacher/types";

interface ClassProgressViewProps {
  classDetail: ClassDetail;
}

const ClassProgressView: React.FC<ClassProgressViewProps> = ({ classDetail }) => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssignments();
  }, [classDetail.id]);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const response = await classApi.getClassAssignments(classDetail.id);
      
      if (response.success) {
        setAssignments(response.data);
      }
    } catch (error) {
      console.error('Error loading assignments:', error);
    } finally {
      setLoading(false);
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
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Theo dõi tiến độ</h3>
          <p className="text-sm text-gray-600">Xem báo cáo và phân tích hiệu suất học tập của lớp</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{classDetail.stats.totalMembers}</p>
                <p className="text-sm text-blue-700">Học sinh</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{assignments.length}</p>
                <p className="text-sm text-green-700">Bài tập</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{classDetail.stats.averageScore}</p>
                <p className="text-sm text-purple-700">Điểm TB</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  {assignments.length > 0 ? Math.round((assignments.filter(a => new Date(a.end_time) < new Date()).length / assignments.length) * 100) : 0}%
                </p>
                <p className="text-sm text-orange-700">Hoàn thành</p>
              </div>
            </div>
          </div>
        </div>

        {/* Assignments List */}
        {assignments.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h4 className="font-medium text-gray-900">Danh sách bài tập</h4>
            </div>
            <div className="divide-y divide-gray-200">
              {assignments.map((assignment: any) => {
                const isActive = new Date(assignment.start_time) <= new Date() && new Date(assignment.end_time) >= new Date();
                const isPast = new Date(assignment.end_time) < new Date();
                
                return (
                  <div key={assignment._id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h5 className="font-medium text-gray-900">
                            {assignment.exam?.title || 'Untitled Assignment'}
                          </h5>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            isActive ? 'bg-green-100 text-green-700' :
                            isPast ? 'bg-gray-100 text-gray-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {isActive ? 'Đang diễn ra' : isPast ? 'Đã kết thúc' : 'Sắp tới'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{assignment.exam?.description || 'No description'}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {assignment.exam?.duration_min || 0} phút
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {assignment.exam?.total_score || 0} điểm
                          </span>
                          <span>Bắt đầu: {new Date(assignment.start_time).toLocaleDateString('vi-VN')}</span>
                          <span>Kết thúc: {new Date(assignment.end_time).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <button className="px-4 py-2 text-sm text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Chart Placeholder */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-4">Biểu đồ tiến độ học tập</h4>
          <div className="h-64 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p>Biểu đồ tiến độ học tập</p>
              <p className="text-sm mt-1">Dữ liệu sẽ hiển thị khi có kết quả bài thi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassProgressView;