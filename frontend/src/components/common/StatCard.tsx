import React from "react";

interface Props {
  label: string;
  value: number | string;
  progressPercent?: number;
  className?: string;
  children?: React.ReactNode;
}

export default function StatCard({
  label,
  value,
  progressPercent,
  className,
  children,
}: Props) {
  return (
    <div className={`stat-card ${className || ""}`}>
      <div className="stat-label">{label}</div>

      <div className="stat-value">{value}</div>

      {progressPercent !== undefined && (
        <div className="stat-progress-track">
          <div
            className="stat-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {children && <div className="stat-children">{children}</div>}
    </div>
  );
}
