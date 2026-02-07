import clsx from "clsx";

export type BadgeVariant =
  | "critical"
  | "high"
  | "medium"
  | "low"
  | "success"
  | "failed"
  | "running"
  | "open"
  | "resolved";

interface Props {
  variant: BadgeVariant;
  children?: React.ReactNode;
  className?: string;
}

export function Badge({ variant, children, className }: Props) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold border backdrop-blur",
        badgeStyles[variant],
        className
      )}
    >
      {children ?? variant.toUpperCase()}
    </span>
  );
}

const badgeStyles: Record<BadgeVariant, string> = {
  /* Severity */
  critical:
    "bg-red-500/10 text-red-400 border-red-500/30",
  high:
    "bg-orange-500/10 text-orange-400 border-orange-500/30",
  medium:
    "bg-yellow-500/10 text-yellow-300 border-yellow-500/30",
  low:
    "bg-green-500/10 text-green-400 border-green-500/30",

  /* Scan status */
  success:
    "bg-green-500/10 text-green-400 border-green-500/30",
  failed:
    "bg-red-500/10 text-red-400 border-red-500/30",
  running:
    "bg-blue-500/10 text-blue-400 border-blue-500/30",

  /* Finding lifecycle */
  open:
    "bg-orange-500/10 text-orange-400 border-orange-500/30",
  resolved:
    "bg-green-500/10 text-green-400 border-green-500/30",
};
