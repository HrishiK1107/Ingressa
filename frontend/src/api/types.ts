export type Asset = {
  id: string;
  asset_type: string;
  name?: string | null;
  region?: string | null;
  account_id?: string | null;

  // optional metadata from backend
  raw?: unknown;
  created_at?: string | null;
  updated_at?: string | null;
};

export type Finding = {
  id: string;

  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO" | string;
  status: "OPEN" | "RESOLVED" | "SUPPRESSED" | string;

  policy_id: string;

  resource_type: string;
  resource_id: string;

  region?: string | null;

  risk_score?: number | null;
  last_seen?: string | null;

  evidence?: unknown;
  remediation?: unknown;

  created_at?: string | null;
  updated_at?: string | null;
};

export type FindingEvent = {
  id: string;
  finding_id: string;

  event_type: "CREATED" | "UPDATED" | "RESOLVED" | string;
  created_at: string;

  snapshot?: unknown;
};

export type ScanRun = {
  id: string;

  mode: "mock" | "aws" | string;
  status: "RUNNING" | "SUCCESS" | "FAILED" | string;

  started_at?: string | null;
  completed_at?: string | null;

  assets_count?: number | null;
  findings_count?: number | null;

  error?: string | null;
};

export type AdvisorResponse = {
  summary: string;

  attack_narrative?: string;
  impact?: string;
  recommended_action?: string;

  // if backend returns more structured data later
  details?: unknown;
};
