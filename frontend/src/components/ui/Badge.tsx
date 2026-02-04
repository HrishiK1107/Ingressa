type Variant = "default" | "success" | "warning" | "danger" | "neutral";

export default function Badge({
  label,
  variant = "default",
  className = "",
}: {
  label: string;
  variant?: Variant;
  className?: string;
}) {
  const map: Record<Variant, string> = {
    default: "border-white/15 bg-white/5 text-white/70",
    neutral: "border-white/15 bg-white/5 text-white/70",
    success: "border-green-400/25 bg-green-500/10 text-green-300",
    warning: "border-orange-400/25 bg-orange-500/10 text-orange-300",
    danger: "border-red-400/25 bg-red-500/10 text-red-300",
  };

  return (
    <div
      className={[
        "inline-flex items-center h-7 px-3 rounded-full border text-xs tracking-wide",
        map[variant],
        className,
      ].join(" ")}
    >
      {label}
    </div>
  );
}
