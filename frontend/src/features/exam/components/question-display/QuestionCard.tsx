// src/features/exam/components/question-display/QuestionCard.tsx
"use client";

import React from "react";
import { Question } from "../../types";
import { AnswerData } from "../../types/answer";
import Badge from "@/components/ui/Badge";
import MultipleChoiceInput from "../answer-input/MultipleChoiceInput";
import EssayInput from "../answer-input/EssayInput";
import ShortAnswerInput from "../answer-input/ShortAnswerInput";
import TrueFalseInput from "../answer-input/TrueFalseInput";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  answer?: AnswerData;
  onAnswerChange: (answer: AnswerData) => void;
  onFlagToggle?: () => void;
  isFlagged: boolean;
  isReviewMode?: boolean;
  showCorrectAnswer?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  answer,
  onAnswerChange,
  onFlagToggle,
  isFlagged,
  isReviewMode = false,
  showCorrectAnswer = false,
}) => {
  const renderQuestionInput = () => {
    const baseAnswer: AnswerData = answer || {
      questionId: question._id,
      answerText: "",
      selectedOptions: [],
      isAnswered: false,
      lastModified: new Date(),
    };

    switch (question.type) {
      case "multiple_choice":
        return (
          <MultipleChoiceInput
            question={question}
            selectedOptions={baseAnswer.selectedOptions}
            onChange={(selected) =>
              onAnswerChange({
                ...baseAnswer,
                selectedOptions: selected,
                isAnswered: selected.length > 0,
              })
            }
            isReviewMode={isReviewMode}
            showCorrectAnswer={showCorrectAnswer}
          />
        );

      case "essay":
        return (
          <EssayInput
            value={baseAnswer.answerText || ""}
            onChange={(text) =>
              onAnswerChange({
                ...baseAnswer,
                answerText: text,
                isAnswered: text.trim().length > 0,
              })
            }
            disabled={isReviewMode}
          />
        );

      case "short_answer":
        return (
          <ShortAnswerInput
            value={baseAnswer.answerText || ""}
            onChange={(text) =>
              onAnswerChange({
                ...baseAnswer,
                answerText: text,
                isAnswered: text.trim().length > 0,
              })
            }
            disabled={isReviewMode}
            correctAnswer={
              showCorrectAnswer ? question.correctAnswer : undefined
            }
          />
        );

      case "true_false":
        return (
          <TrueFalseInput
            selectedOption={baseAnswer.selectedOptions[0]}
            onChange={(option) =>
              onAnswerChange({
                ...baseAnswer,
                selectedOptions: [option],
                isAnswered: true,
              })
            }
            disabled={isReviewMode}
            correctAnswer={
              showCorrectAnswer
                ? question.options.find((o) => o.isCorrect)?.text
                : undefined
            }
          />
        );
    }
  };

  const getBadgeVariant = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "active";
      case "medium":
        return "upcoming";
      case "hard":
        return "completed";
      default:
        return "active";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-semibold text-gray-500">
              Question {questionNumber}
            </span>
            <Badge variant={getBadgeVariant(question.difficulty)}>
              {question.difficulty}
            </Badge>
            <span className="text-sm text-gray-500">
              {question.points} {question.points === 1 ? "point" : "points"}
            </span>
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            {question.content}
          </h3>
        </div>

        {onFlagToggle && !isReviewMode && (
          <button
            onClick={onFlagToggle}
            className={`p-2 rounded-lg transition-colors ${
              isFlagged
                ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            🚩
          </button>
        )}
      </div>

      <div className="mt-6">{renderQuestionInput()}</div>
    </div>
  );
};

export default QuestionCard;
