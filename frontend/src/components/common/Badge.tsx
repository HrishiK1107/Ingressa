interface Props {
  label: string;
  variant?: "severity" | "status";
}

export default function Badge({ label, variant }: Props) {
  let bg = "var(--bg-elevated)";
  let color = "var(--text-primary)";

  if (variant === "status") {
    if (label === "SUCCESS") bg = "var(--status-success)";
    else if (label === "FAILED") bg = "var(--status-failed)";
    else if (label === "RUNNING") bg = "var(--status-running)";
    else bg = "var(--status-default)";
    color = "#ffffff";
  }

  if (variant === "severity") {
    if (label === "CRITICAL") bg = "var(--severity-critical)";
    else if (label === "HIGH") bg = "var(--severity-high)";
    else if (label === "MEDIUM") bg = "var(--severity-medium)";
    else bg = "var(--severity-low)";
    color = "#ffffff";
  }

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: "6px",
        fontSize: "12px",
        fontWeight: 600,
        backgroundColor: bg,
        color,
        display: "inline-block",
      }}
    >
      {label}
    </span>
  );
}
