export interface Asset {
  id: string;
  type: string;
  name: string;
  provider: string;
  region?: string;
}

export interface AssetsResponse {
  items: Asset[];
  total: number;
}

export interface Finding {
  finding_id: number;
  policy_id: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  risk_score: number;
  status: "OPEN" | "RESOLVED";
  resource_id: string;
  resource_type: string;
  region: string | null;
  first_seen: string;
  last_seen: string;
}

/** BACKEND RETURNS ARRAY */
export type FindingsResponse = Finding[];

export interface ScanRun {
  scan_id: string;
  mode: string;
  status: "RUNNING" | "SUCCESS" | "FAILED";
  started_at: string;
  finished_at?: string | null;
  asset_count: number;
  finding_count: number;
  duration_ms: number;
  error_reason?: string | null;
}

export interface ScansResponse {
  scans: ScanRun[];
}
