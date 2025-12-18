"use client";

import { QuizQuestion } from "@/lib/quiz-data";

interface QuestionCardProps {
  question: QuizQuestion;
  selectedValue: string | null;
  onSelect: (value: string) => void;
}

export function QuestionCard({
  question,
  selectedValue,
  onSelect,
}: QuestionCardProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold text-[#111111] mb-8 text-center">
        {question.question}
      </h2>

      <div className="space-y-3">
        {question.options.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={`
              w-full p-5 rounded-2xl border-2 transition-all duration-200
              flex items-center gap-4 text-left
              ${
                selectedValue === option.value
                  ? "border-[#55C1B3] bg-[#55C1B3]/5 shadow-md"
                  : "border-[#E5E7EB] bg-white hover:border-[#55C1B3]/50 hover:shadow-sm"
              }
            `}
          >
            {option.icon && (
              <span className="text-3xl flex-shrink-0">{option.icon}</span>
            )}
            <span
              className={`text-lg font-medium ${
                selectedValue === option.value
                  ? "text-[#111111]"
                  : "text-[#4A4A4A]"
              }`}
            >
              {option.label}
            </span>
            {selectedValue === option.value && (
              <span className="ml-auto text-[#55C1B3] text-xl">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
