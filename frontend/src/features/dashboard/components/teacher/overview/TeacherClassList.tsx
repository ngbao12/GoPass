"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui";
import { fetchTeacherClassesOverview, QuickClassInfo } from "@/services/teacher/statsApi";

const TeacherClassList: React.FC = () => {
  const router = useRouter();
  const [classes, setClasses] = useState<QuickClassInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTeacherClassesOverview();
        setClasses(data);
      } catch (err) {
        console.error("Failed to fetch classes:", err);
        setError("Không thể tải danh sách lớp học");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleViewAll = () => {
    router.push("/dashboard/teacher/classes");
  };

  const handleClassClick = (classId: string) => {
    router.push(`/dashboard/teacher/classes/${classId}`);
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        </div>
        <div className="divide-y divide-gray-200">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6">
              <div className="h-16 bg-gray-100 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Lớp học của tôi</h3>
            <p className="text-sm text-gray-600 mt-1">Quản lý và theo dõi các lớp học</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-blue-100 text-blue-700">
              {classes.length} lớp
            </Badge>
            <button
              onClick={handleViewAll}
              className="text-sm text-teal-600 hover:text-teal-700 hover:bg-teal-50 px-3 py-1 rounded-lg transition-colors"
            >
              Xem tất cả →
            </button>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {classes.length > 0 ? (
          classes.map((classItem) => (
            <div
              key={classItem.id}
              className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group"
              onClick={() => handleClassClick(classItem.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-800 group-hover:text-teal-600 transition-colors">
                      {classItem.name}
                    </h4>
                    <Badge className="bg-teal-100 text-teal-700 text-xs">
                      {classItem.subject}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {classItem.studentCount} học sinh
                    </span>
                    {classItem.pendingRequests > 0 && (
                      <span className="flex items-center gap-1 text-orange-600 font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {classItem.pendingRequests} yêu cầu chờ
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      Mã: {classItem.code}
                    </span>
                  </div>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-gray-600 mb-4">Chưa có lớp học nào</p>
            <button
              onClick={handleViewAll}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Tạo lớp học đầu tiên
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherClassList;