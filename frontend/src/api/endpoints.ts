/* =========================================================
   Ingressa API Endpoints (LOCKED CONTRACT)
   Do not inline URLs anywhere else in the app.
========================================================= */

export const ENDPOINTS = {
  /* --------------------
     System
  -------------------- */
  health: () => `/health`,
  ASSETS: "/assets",
  FINDINGS: "/findings",
  SCANS: "/scans",

  /* --------------------
     Scans
  -------------------- */
  scans: () => `/scans`,
  runScan: (mode: "mock" | "aws") => `/scans/run?mode=${mode}`,

  /* --------------------
     Assets
  -------------------- */
  assets: (params?: {
    asset_type?: string;
    region?: string;
    q?: string;
  }) => {
    const search = new URLSearchParams(
      Object.entries(params ?? {}).filter(
        ([, v]) => v !== undefined && v !== ""
      ) as [string, string][]
    );
    return `/assets${search.toString() ? `?${search}` : ""}`;
  },

  /* --------------------
     Findings
  -------------------- */
  findings: (params?: {
    severity?: string;
    status?: string;
    policy_id?: string;
    q?: string;
    limit?: number;
  }) => {
    const search = new URLSearchParams(
      Object.entries(params ?? {}).filter(
        ([, v]) => v !== undefined && v !== ""
      ) as [string, string][]
    );
    return `/findings${search.toString() ? `?${search}` : ""}`;
  },

  findingById: (findingId: string) => `/findings/${findingId}`,
  findingEvents: (findingId: string) =>
    `/findings/${findingId}/events`,

  /* --------------------
     Reports
  -------------------- */
  exportReport: (params: {
    format: "csv" | "json";
    severity?: string;
    status?: string;
  }) => {
    const search = new URLSearchParams(
      Object.entries(params).filter(
        ([, v]) => v !== undefined && v !== ""
      ) as [string, string][]
    );
    return `/reports/export?${search}`;
  },

  /* --------------------
     AI Advisor
  -------------------- */
  advisorExplain: (findingId: string) =>
    `/ai/explain/${findingId}`,
};
