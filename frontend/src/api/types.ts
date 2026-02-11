export interface Finding {
  finding_id: number;
  policy_id: string;
  severity: string;
  risk_score: number;
  status: string;
  resource_id: string;
  resource_type: string;
  region: string;
  first_seen: string;
  last_seen: string;
}

export interface FindingEvent {
  event_type: string;
  timestamp: string;
}
