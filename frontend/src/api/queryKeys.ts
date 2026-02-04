export type FindingsFilters = {
  severity?: string;
  status?: string;
  policy_id?: string;
  q?: string;
  limit?: number;
};

export type AssetsFilters = {
  asset_type?: string;
  region?: string;
  q?: string;
};

export const queryKeys = {
  health: () => ["health"] as const,

  findings: (filters: FindingsFilters = {}) => ["findings", filters] as const,
  finding: (id: string) => ["finding", id] as const,
  findingEvents: (id: string) => ["findingEvents", id] as const,

  assets: (filters: AssetsFilters = {}) => ["assets", filters] as const,

  scans: () => ["scans"] as const,

  advisor: (finding_id: string) => ["advisor", finding_id] as const,
} as const;
