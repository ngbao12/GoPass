"use client";

import React, { useEffect, useState } from "react";
import { fetchTeacherStats } from "@/services/teacher";
import type { TeacherStats } from "@/features/dashboard/types/teacher";

interface SolidCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  bgColorClass: string;
}

const SolidCard: React.FC<SolidCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  bgColorClass,
}) => {
  return (
    <div
      className={`
        ${bgColorClass} 
        rounded-lg p-6 relative overflow-hidden text-white shadow-sm
        cursor-default select-none transition-transform hover:-translate-y-1
      `}
    >
      <div className="absolute top-4 right-4 opacity-20">{icon}</div>
      <div className="relative z-10">
        <p className="text-xs font-medium uppercase tracking-wider opacity-90">{title}</p>
        <p className="text-3xl md:text-4xl font-bold mt-2">{value}</p>
        {subtitle && <p className="text-sm font-medium mt-1 opacity-80">{subtitle}</p>}
      </div>
    </div>
  );
};

const TeacherStatsGrid: React.FC = () => {
  const [stats, setStats] = useState<TeacherStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const iconClasses = "w-12 h-12";

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTeacherStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to load teacher stats:", err);
        setError("Không thể tải thống kê");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
        <p className="text-red-600 text-sm">{error || "Có lỗi xảy ra"}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Card 1: LỚP HỌC */}
      <SolidCard
        title="Lớp học"
        value={stats.totalClasses}
        bgColorClass="bg-teal-500"
        icon={
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001 1h6a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.212c-1.206 0-2.333.337-3.278.925a8.927 8.927 0 00-1.255-.574C6.845 16.028 6 16.482 6 17v1z" />
          </svg>
        }
      />

      {/* Card 2: HỌC SINH */}
      <SolidCard
        title="Học sinh"
        value={stats.totalStudents}
        bgColorClass="bg-emerald-500"
        icon={
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
        }
      />

      {/* Card 3: ĐỀ THI */}
      <SolidCard
        title="Đề thi"
        value={stats.totalExams}
        bgColorClass="bg-blue-500"
        icon={
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        }
      />

      {/* Card 4: YÊU CẦU CHỜ */}
      <SolidCard
        title="Yêu cầu chờ"
        value={stats.pendingRequests}
        bgColorClass="bg-orange-500"
        icon={
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        }
      />
    </div>
  );
};

export default TeacherStatsGrid;