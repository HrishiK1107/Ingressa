// frontend/src/utils/format.ts

export function formatDate(iso: string): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleString();
}

export function formatDuration(ms: number): string {
  if (!ms || ms < 0) return "-";

  const sec = Math.floor(ms / 1000);
  const min = Math.floor(sec / 60);
  const rem = sec % 60;

  if (min === 0) return `${rem}s`;
  return `${min}m ${rem}s`;
}

export const severityColorMap = {
  CRITICAL: "critical",
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
  INFO: "info",
} as const;

export function riskBucket(score: number): "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" {
  if (score >= 90) return "CRITICAL";
  if (score >= 70) return "HIGH";
  if (score >= 40) return "MEDIUM";
  return "LOW";
}
