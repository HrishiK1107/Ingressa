export const ENDPOINTS = {
  health: () => `/health`,

  scans: () => `/scans`,
  scanRun: (mode: "mock" | "aws") => `/scans/run?mode=${mode}`,

  assets: (params?: {
    asset_type?: string;
    region?: string;
    q?: string;
  }) => {
    const sp = new URLSearchParams();

    if (params?.asset_type) sp.set("asset_type", params.asset_type);
    if (params?.region) sp.set("region", params.region);
    if (params?.q) sp.set("q", params.q);

    const qs = sp.toString();
    return qs ? `/assets?${qs}` : `/assets`;
  },

  findings: (params?: {
    severity?: string;
    status?: string;
    policy_id?: string;
    q?: string;
    limit?: number;
  }) => {
    const sp = new URLSearchParams();

    if (params?.severity) sp.set("severity", params.severity);
    if (params?.status) sp.set("status", params.status);
    if (params?.policy_id) sp.set("policy_id", params.policy_id);
    if (params?.q) sp.set("q", params.q);
    if (typeof params?.limit === "number") sp.set("limit", String(params.limit));

    const qs = sp.toString();
    return qs ? `/findings?${qs}` : `/findings`;
  },

  findingById: (finding_id: string | number) => `/findings/${finding_id}`,
  findingEvents: (finding_id: string | number) => `/findings/${finding_id}/events`,

  exportReports: (params?: {
    format: "csv" | "json";
    severity?: string;
    status?: string;
  }) => {
    const sp = new URLSearchParams();

    sp.set("format", params?.format ?? "json");
    if (params?.severity) sp.set("severity", params.severity);
    if (params?.status) sp.set("status", params.status);

    return `/reports/export?${sp.toString()}`;
  },

  advisorExplain: (finding_id: string | number) => `/ai/explain/${finding_id}`,
} as const;
