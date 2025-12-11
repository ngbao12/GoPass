// src/app/(protected)/exam/[examId]/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { mockExam } from "@/features/exam/data/mock-exam";

export default function ExamDetailPage({
  params,
}: {
  params: { examId: string };
}) {
  const router = useRouter();
  const exam = mockExam; // In production, fetch by params.examId

  const handleStartExam = () => {
    router.push(`/exam/${params.examId}/take`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Exam Info Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {exam.title}
          </h1>
          <p className="text-gray-700 mb-6">{exam.description}</p>

          {/* Exam Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Duration</p>
              <p className="text-2xl font-bold text-gray-900">
                {exam.durationMinutes} min
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Questions</p>
              <p className="text-2xl font-bold text-gray-900">
                {exam.totalQuestions}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Points</p>
              <p className="text-2xl font-bold text-gray-900">
                {exam.totalPoints}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Subject</p>
              <p className="text-lg font-semibold text-gray-900">
                {exam.subject}
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">
              Instructions
            </h2>
            <ul className="space-y-2 text-blue-800">
              <li>
                • You have {exam.durationMinutes} minutes to complete this exam
              </li>
              <li>
                • The exam contains {exam.totalQuestions} questions worth{" "}
                {exam.totalPoints} points total
              </li>
              <li>
                • You can navigate between questions using the navigation
                buttons
              </li>
              <li>• Your answers will be auto-saved every 30 seconds</li>
              <li>• You can flag questions for review</li>
              <li>• Click "Submit Exam" when you're finished</li>
              <li>• Once submitted, you cannot change your answers</li>
            </ul>
          </div>

          {/* Start Button */}
          <div className="flex justify-center">
            <Button
              variant="primary"
              onClick={handleStartExam}
              className="px-12 py-4 text-lg"
            >
              Start Exam
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
