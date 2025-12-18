"use client";

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-[#4A4A4A]">
          Pergunta {current} de {total}
        </span>
        <span className="text-sm font-medium text-[#111111]">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#55C1B3] transition-all duration-300 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
