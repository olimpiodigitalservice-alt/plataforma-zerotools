export interface QuizQuestion {
  id: number;
  key: string;
  question: string;
  options: {
    value: string;
    label: string;
    icon?: string;
  }[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    key: "main_goal",
    question: "Qual é seu principal objetivo?",
    options: [
      { value: "lose_weight", label: "Emagrecer", icon: "📉" },
      { value: "gain_muscle", label: "Ganhar massa muscular", icon: "💪" },
      { value: "tone_body", label: "Definir o corpo", icon: "⚡" },
      { value: "improve_health", label: "Melhorar saúde e energia", icon: "❤️" },
    ],
  },
  {
    id: 2,
    key: "activity_level",
    question: "Como é seu nível atual de atividade física?",
    options: [
      { value: "sedentary", label: "Sedentário", icon: "🛋️" },
      { value: "lightly_active", label: "Levemente ativo", icon: "🚶" },
      { value: "moderately_active", label: "Moderadamente ativo", icon: "🏃" },
      { value: "very_active", label: "Muito ativo", icon: "🏋️" },
    ],
  },
  {
    id: 3,
    key: "previous_attempts",
    question: "Você já tentou emagrecer antes?",
    options: [
      { value: "never", label: "Nunca", icon: "🆕" },
      { value: "few_times", label: "Algumas vezes", icon: "🔄" },
      { value: "many_times", label: "Muitas vezes", icon: "🔁" },
    ],
  },
  {
    id: 4,
    key: "main_difficulty",
    question: "Qual sua maior dificuldade hoje?",
    options: [
      { value: "lack_of_time", label: "Falta de tempo", icon: "⏰" },
      { value: "lack_of_consistency", label: "Falta de constância", icon: "📊" },
      { value: "disorganized_eating", label: "Alimentação desorganizada", icon: "🍽️" },
      { value: "motivation", label: "Motivação", icon: "🎯" },
    ],
  },
  {
    id: 5,
    key: "supplements_usage",
    question: "Você utiliza suplementos atualmente?",
    options: [
      { value: "yes", label: "Sim", icon: "✅" },
      { value: "no", label: "Não", icon: "❌" },
      { value: "planning_to", label: "Pretendo usar", icon: "🤔" },
    ],
  },
  {
    id: 6,
    key: "weekly_dedication",
    question: "Quantos dias por semana você consegue se dedicar?",
    options: [
      { value: "1_2_days", label: "1–2 dias", icon: "📅" },
      { value: "3_4_days", label: "3–4 dias", icon: "📆" },
      { value: "5_plus_days", label: "5 dias ou mais", icon: "🗓️" },
    ],
  },
];

export interface QuizAnswers {
  [key: string]: string;
}

export const getQuizSummary = (answers: QuizAnswers): string => {
  const goalMap: { [key: string]: string } = {
    lose_weight: "emagrecer",
    gain_muscle: "ganhar massa muscular",
    tone_body: "definir o corpo",
    improve_health: "melhorar saúde e energia",
  };

  const activityMap: { [key: string]: string } = {
    sedentary: "sedentário",
    lightly_active: "levemente ativo",
    moderately_active: "moderadamente ativo",
    very_active: "muito ativo",
  };

  const goal = goalMap[answers.main_goal] || "melhorar sua saúde";
  const activity = activityMap[answers.activity_level] || "iniciante";

  return `Seu objetivo é ${goal} e você está ${activity}. Vamos criar um plano personalizado para você alcançar seus resultados de forma sustentável.`;
};
