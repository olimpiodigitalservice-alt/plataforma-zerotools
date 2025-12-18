"use client";

import { useState, useEffect } from "react";
import { quizQuestions, QuizAnswers } from "@/lib/quiz-data";
import { ProgressBar } from "@/components/quiz/progress-bar";
import { QuestionCard } from "@/components/quiz/question-card";
import { FinalScreen } from "@/components/quiz/final-screen";
import { ArrowLeft } from "lucide-react";

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [showFinal, setShowFinal] = useState(false);

  // Carregar progresso salvo
  useEffect(() => {
    const savedAnswers = localStorage.getItem("quiz_progress");
    const savedQuestion = localStorage.getItem("quiz_current_question");
    
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
    
    if (savedQuestion) {
      setCurrentQuestion(parseInt(savedQuestion));
    }
  }, []);

  // Salvar progresso
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem("quiz_progress", JSON.stringify(answers));
      localStorage.setItem("quiz_current_question", currentQuestion.toString());
    }
  }, [answers, currentQuestion]);

  const currentQuestionData = quizQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === quizQuestions.length - 1;

  const handleSelect = (value: string) => {
    setSelectedValue(value);
  };

  const handleNext = () => {
    if (!selectedValue) return;

    const newAnswers = {
      ...answers,
      [currentQuestionData.key]: selectedValue,
    };
    setAnswers(newAnswers);

    if (isLastQuestion) {
      setShowFinal(true);
      // Limpar progresso temporário
      localStorage.removeItem("quiz_progress");
      localStorage.removeItem("quiz_current_question");
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedValue(null);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      const previousKey = quizQuestions[currentQuestion - 1].key;
      setSelectedValue(answers[previousKey] || null);
    }
  };

  if (showFinal) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4">
        <FinalScreen answers={answers} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB] px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className={`p-2 rounded-lg transition-colors ${
              currentQuestion === 0
                ? "text-[#E5E7EB] cursor-not-allowed"
                : "text-[#4A4A4A] hover:bg-[#F9FAFB]"
            }`}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-[#111111]">ZeroTools</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-4xl">
          <ProgressBar
            current={currentQuestion + 1}
            total={quizQuestions.length}
          />

          <QuestionCard
            question={currentQuestionData}
            selectedValue={selectedValue}
            onSelect={handleSelect}
          />

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleNext}
              disabled={!selectedValue}
              className={`
                px-12 py-4 rounded-2xl font-semibold text-lg transition-all duration-200
                ${
                  selectedValue
                    ? "bg-[#55C1B3] text-white hover:bg-[#4AB0A2] shadow-md hover:shadow-lg"
                    : "bg-[#E5E7EB] text-[#4A4A4A] cursor-not-allowed"
                }
              `}
            >
              {isLastQuestion ? "Finalizar" : "Continuar"}
            </button>
          </div>
        </div>
      </div>

      {/* Footer hint */}
      <div className="bg-white border-t border-[#E5E7EB] px-4 py-3">
        <p className="text-center text-sm text-[#4A4A4A]">
          Suas respostas nos ajudam a personalizar sua experiência
        </p>
      </div>
    </div>
  );
}
