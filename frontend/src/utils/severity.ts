export const severityColorMap: Record<string, string> = {
  CRITICAL: "text-red-300",
  HIGH: "text-orange-300",
  MEDIUM: "text-yellow-300",
  LOW: "text-green-300",
  INFO: "text-blue-300",
};

export function riskBucketFromScore(score?: number | null): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" {
  const s = score ?? 0;
  if (s >= 85) return "CRITICAL";
  if (s >= 65) return "HIGH";
  if (s >= 40) return "MEDIUM";
  return "LOW";
}
