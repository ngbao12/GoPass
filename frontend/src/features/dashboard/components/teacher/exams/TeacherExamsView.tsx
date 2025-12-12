"use client";

import React, { useState } from "react";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import SectionHeader from "@/components/ui/SectionHeader";
import { Button, Badge, Input } from "@/components/ui";
import { mockTeacherData } from "@/features/dashboard/data/mock-teacher";
import AssignExamModal from "./AssignExamModal";
import DeleteExamModal from "./DeleteExamModal";
import QuestionPreviewModal from "./QuestionPreviewModal";

const TeacherExamsView: React.FC = () => {
    const { userRole } = useDashboard();
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [selectedExam, setSelectedExam] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const exams = mockTeacherData.exams;

    const filteredExams = exams.filter(exam => {
        const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exam.subject.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || exam.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleAssignExam = (examData: any) => {
        console.log("Assigning exam:", examData);
        setShowAssignModal(false);
    };

    const handleDeleteExam = (examId: string) => {
        console.log("Deleting exam:", examId);
        setShowDeleteModal(false);
        setSelectedExam(null);
    };

    const handlePreviewExam = (exam: any) => {
        setSelectedExam(exam);
        setShowPreviewModal(true);
    };

    const openDeleteModal = (exam: any) => {
        setSelectedExam(exam);
        setShowDeleteModal(true);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return <Badge className="bg-green-100 text-green-700">Đang diễn ra</Badge>;
            case "upcoming":
                return <Badge className="bg-orange-100 text-orange-700">Sắp diễn ra</Badge>;
            case "completed":
                return <Badge className="bg-gray-100 text-gray-700">Đã hoàn thành</Badge>;
            default:
                return <Badge className="bg-gray-100 text-gray-700">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <SectionHeader
                title="Quản lý đề thi"
                subtitle={`Tổng cộng ${exams.length} đề thi`}
                action={
                    <Button
                        variant="primary"
                        onClick={() => setShowAssignModal(true)}
                        className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600"
                    >
                        <span>+</span>
                        Tạo đề thi mới
                    </Button>
                }
            />

            {/* Search */}
            <div>
                <Input
                    type="text"
                    placeholder="Tìm kiếm theo tên đề thi hoặc môn học..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full text-gray-900 placeholder-gray-500"
                    style={{
                        color: '#111827'
                    }}
                />
            </div>

            {/* Exams Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                        <div className="col-span-4">Tên đề thi</div>
                        <div className="col-span-2 text-center">Câu hỏi</div>
                        <div className="col-span-2 text-center">Thời gian</div>
                        <div className="col-span-2 text-center">Trạng thái</div>
                        <div className="col-span-2 text-center">Thao tác</div>
                    </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-200">
                    {filteredExams.length > 0 ? (
                        filteredExams.map((exam) => (
                            <div key={exam.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                <div className="grid grid-cols-12 gap-4 items-center">
                                    {/* Exam Title */}
                                    <div className="col-span-4">
                                        <div className="flex flex-col">
                                            <h3 className="font-medium text-gray-900 mb-1">
                                                {exam.title}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {exam.className}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Questions Count */}
                                    <div className="col-span-2 text-center">
                                        <span className="text-gray-900 font-medium">
                                            {exam.totalQuestions}
                                        </span>
                                    </div>

                                    {/* Duration */}
                                    <div className="col-span-2 text-center">
                                        <span className="text-gray-900 font-medium">
                                            {exam.duration} phút
                                        </span>
                                    </div>

                                    {/* Status */}
                                    <div className="col-span-2 text-center">
                                        {getStatusBadge(exam.status)}
                                    </div>

                                    {/* Actions */}
                                    <div className="col-span-2 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            {/* Preview Button */}
                                            <button
                                                onClick={() => handlePreviewExam(exam)}
                                                className="p-2 text-gray-400 hover:text-teal-600 transition-colors"
                                                title="Xem trước"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>

                                            {/* Assign Button */}
                                            <button
                                                onClick={() => setShowAssignModal(true)}
                                                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                                title="Gán đề thi"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                                </svg>
                                            </button>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => openDeleteModal(exam)}
                                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                                title="Xóa"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="px-6 py-12 text-center">
                            <div className="text-gray-500 mb-4">Không tìm thấy đề thi nào</div>
                            <Button variant="primary" onClick={() => setShowAssignModal(true)}>
                                Tạo đề thi đầu tiên
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {showAssignModal && (
                <AssignExamModal
                    isOpen={showAssignModal}
                    onClose={() => setShowAssignModal(false)}
                    onSubmit={handleAssignExam}
                />
            )}

            {showDeleteModal && selectedExam && (
                <DeleteExamModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={() => handleDeleteExam(selectedExam.id)}
                    examTitle={selectedExam.title}
                />
            )}

            {showPreviewModal && selectedExam && (
                <QuestionPreviewModal
                    isOpen={showPreviewModal}
                    onClose={() => setShowPreviewModal(false)}
                    exam={selectedExam}
                />
            )}
        </div>
    );
};

export default TeacherExamsView;