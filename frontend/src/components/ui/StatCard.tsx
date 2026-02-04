import type { ReactNode } from "react";

export default function StatCard({
  title,
  value,
  footer,
}: {
  title: string;
  value: string;
  footer?: ReactNode;
}) {
  return (
    <div className="rounded-2xl glass glass-glow card-pad flex flex-col gap-2">
      <div className="text-xs text-white/50">{title}</div>
      <div className="text-2xl text-white">{value}</div>
      {footer ? <div className="text-xs">{footer}</div> : null}
    </div>
  );
}
