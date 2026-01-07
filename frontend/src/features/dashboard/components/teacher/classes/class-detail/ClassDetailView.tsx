"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { classApi } from "@/services/teacher";
import type { ClassDetail } from "@/services/teacher/types";
import ClassDetailHeader from "./ClassDetailHeader";
import ClassDetailTabs from "./ClassDetailTabs";
import ClassMembersView from "./members/ClassMembersView";
import ClassProgressView from "./progress/ClassProgressView";

type TabType = "members" | "progress";

const ClassDetailView: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const classId = params.classId as string;
  
  const [classDetail, setClassDetail] = useState<ClassDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("members");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadClassDetail();
  }, [classId]);

  const loadClassDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all data in parallel
      const [classResponse, membersResponse, requestsResponse, assignmentsResponse] = await Promise.all([
        classApi.getClassDetail(classId),
        classApi.getClassMembers(classId),
        classApi.getJoinRequests(classId),
        classApi.getClassAssignments(classId)
      ]);
      
      if (classResponse.success) {
        // Enrich the class detail with actual data
        const membersData = membersResponse.success ? ((membersResponse.data as any)?.members || []) : [];
        const requestsData = requestsResponse.success ? ((requestsResponse.data as any)?.requests || []) : [];
        const assignmentsData = assignmentsResponse.success ? (Array.isArray(assignmentsResponse.data) ? assignmentsResponse.data : []) : [];
        
        const enrichedDetail: ClassDetail = {
          ...classResponse.data,
          members: membersData,
          joinRequests: requestsData,
          assignments: assignmentsData,
          stats: {
            totalMembers: membersData.length,
            pendingRequests: requestsData.length,
            activeAssignments: assignmentsData.length,
            averageScore: 0, // TODO: Calculate from submissions
          }
        };
        
        setClassDetail(enrichedDetail);
      } else {
        setError(classResponse.error || "Không thể tải thông tin lớp học");
      }
    } catch (err) {
      console.error("Error loading class detail:", err);
      setError("Đã xảy ra lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.push("/dashboard/teacher/classes");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải thông tin lớp học...</p>
        </div>
      </div>
    );
  }

  if (error || !classDetail) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không thể tải thông tin lớp học</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={handleGoBack}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Quay lại danh sách lớp
          </button>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "members":
        return <ClassMembersView classDetail={classDetail} onUpdate={loadClassDetail} />;
      case "progress":
        return <ClassProgressView classDetail={classDetail} />;
      default:
        return <ClassMembersView classDetail={classDetail} onUpdate={loadClassDetail} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <ClassDetailHeader 
        classDetail={classDetail} 
        onGoBack={handleGoBack}
      />
      
      {/* Tabs */}
      <ClassDetailTabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        stats={classDetail.stats}
      />
      
      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-gray-200">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ClassDetailView;