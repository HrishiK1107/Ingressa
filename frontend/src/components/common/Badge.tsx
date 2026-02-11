interface Props {
  label: string;
  variant?: "severity" | "status";
}

export default function Badge({ label, variant }: Props) {
  let bg = "#e5e7eb";
  let color = "#111827";

  if (variant === "status") {
    if (label === "SUCCESS") bg = "#16a34a";     // green
    else if (label === "FAILED") bg = "#dc2626"; // red
    else if (label === "RUNNING") bg = "#f59e0b"; // amber
    else bg = "#64748b";

    color = "#ffffff";
  }

  if (variant === "severity") {
    bg = "#dc2626";
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
