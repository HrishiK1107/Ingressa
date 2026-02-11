import { theme } from "../../styles/theme";

interface Props {
  label: string;
  variant?: "severity" | "status";
}

export default function Badge({ label, variant }: Props) {
  let bg = "#e5e7eb";
  let color = "#111827";

  if (variant === "severity") {
    bg = theme.colors.severity[
      label as keyof typeof theme.colors.severity
    ] || "#e5e7eb";
    color = "#ffffff";
  }

  if (variant === "status") {
    bg = theme.colors.status[
      label as keyof typeof theme.colors.status
    ] || "#e5e7eb";
    color = "#ffffff";
  }

  return (
    <span
      style={{
        padding: "4px 8px",
        borderRadius: theme.radius,
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
