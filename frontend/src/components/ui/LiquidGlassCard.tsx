import type { ReactNode } from "react";

export default function LiquidGlassCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={["rounded-3xl glass", className].join(" ")}>
      {children}
    </div>
  );
}
