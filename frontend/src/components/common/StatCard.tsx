interface Props {
  label: string;
  value: string | number;
  progressPercent?: number;
}

export default function StatCard({
  label,
  value,
  progressPercent,
}: Props) {
  return (
    <div className="stat-card">
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
    </div>
  );
}
