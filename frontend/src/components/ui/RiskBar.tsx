export default function RiskBar({
  score,
  className = "",
}: {
  score: number;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, score));
  const pct = `${clamped}%`;

  const color =
    clamped >= 85
      ? "bg-red-500"
      : clamped >= 65
      ? "bg-orange-500"
      : clamped >= 40
      ? "bg-yellow-500"
      : "bg-green-500";

  return (
    <div className={["w-full", className].join(" ")}>
      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
        <div className={["h-2", color].join(" ")} style={{ width: pct }} />
      </div>
    </div>
  );
}
