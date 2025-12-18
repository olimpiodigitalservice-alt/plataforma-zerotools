"use client";

import { QuizAnswers, getQuizSummary } from "@/lib/quiz-data";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

interface FinalScreenProps {
  answers: QuizAnswers;
}

export function FinalScreen({ answers }: FinalScreenProps) {
  const router = useRouter();
  const summary = getQuizSummary(answers);

  const handleFinish = () => {
    // Marca o quiz como completado
    localStorage.setItem("quiz_completed", "true");
    localStorage.setItem("quiz_answers", JSON.stringify(answers));
    
    // Redireciona para o dashboard
    router.push("/");
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      <div className="mb-8 flex justify-center">
        <div className="w-20 h-20 bg-[#55C1B3]/10 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-[#55C1B3]" />
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-[#111111] mb-4">
        Pronto! Criamos um ponto de partida para você.
      </h1>

      <p className="text-lg text-[#4A4A4A] mb-8 leading-relaxed">
        {summary}
      </p>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 mb-8 text-left">
        <h3 className="text-lg font-semibold text-[#111111] mb-4">
          O que o ZeroTools fará por você:
        </h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-[#55C1B3] mt-1">✓</span>
            <span className="text-[#4A4A4A]">
              Criar um plano personalizado baseado no seu perfil
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#55C1B3] mt-1">✓</span>
            <span className="text-[#4A4A4A]">
              Acompanhar seu progresso de forma inteligente
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#55C1B3] mt-1">✓</span>
            <span className="text-[#4A4A4A]">
              Enviar lembretes nos momentos certos
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#55C1B3] mt-1">✓</span>
            <span className="text-[#4A4A4A]">
              Ajustar recomendações conforme você evolui
            </span>
          </li>
        </ul>
      </div>

      <button
        onClick={handleFinish}
        className="w-full bg-[#55C1B3] text-white font-semibold py-4 px-8 rounded-2xl hover:bg-[#4AB0A2] transition-colors duration-200 shadow-md hover:shadow-lg"
      >
        Ir para meu painel
      </button>

      <p className="text-sm text-[#4A4A4A] mt-6">
        Você pode editar suas respostas depois nas Configurações
      </p>
    </div>
  );
}
