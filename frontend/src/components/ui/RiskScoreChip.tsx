interface Props {
  score: number;
}

function bucket(score: number) {
  if (score >= 90) return "CRITICAL";
  if (score >= 70) return "HIGH";
  if (score >= 40) return "MEDIUM";
  return "LOW";
}

export function RiskScoreChip({ score }: Props) {
  const level = bucket(score);

  const color =
    level === "CRITICAL"
      ? "bg-red-600 text-white"
      : level === "HIGH"
      ? "bg-orange-500 text-black"
      : level === "MEDIUM"
      ? "bg-yellow-400 text-black"
      : "bg-green-500 text-black";

  return (
    <span
      className={`
        inline-flex items-center
        px-2 py-0.5
        rounded text-xs font-semibold
        ${color}
      `}
    >
      {score.toFixed(1)}
    </span>
  );
}
