interface Props {
  label: string;
  variant?: "severity" | "status";
}

export default function Badge({ label, variant }: Props) {
  const normalized = label.toUpperCase();

  return (
    <span
      className={`badge ${variant || ""} ${normalized.toLowerCase()}`}
    >
      {label}
    </span>
  );
}
