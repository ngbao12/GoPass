'use client';

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import StudentClassDetailView from "@/features/dashboard/components/student/class/StudentClassDetailView";
import { getClassDetailById } from "@/services/student/classApi";
import { ClassDetail } from "@/features/dashboard/types/student/";

export default function ClassDetailsPage() {
  const params = useParams();
  const classId = params.classId as string;
  
  const [classData, setClassData] = useState<ClassDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!classId) return;
    
    const fetchClassData = async () => {
      try {
        setLoading(true);
        const data = await getClassDetailById(classId);
        setClassData(data);
        setError(!data);
      } catch (err) {
        console.error("Error fetching class details:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchClassData();
  }, [classId]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin lớp học...</p>
        </div>
      </div>
    );
  }

  // Error or not found state
  if (error || !classData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy lớp học</h2>
        <p className="text-gray-500">Mã lớp: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{params.classId}</span> không tồn tại.</p>
        <a href="/dashboard" className="mt-4 text-teal-600 hover:underline">Quay về trang chủ</a>
      </div>
    );
  }

  // Render view with data
  return <StudentClassDetailView classData={classData} />;
}