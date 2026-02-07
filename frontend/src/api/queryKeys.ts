/* =========================================================
   TanStack Query Keys (LOCKED)
   Do not inline query keys anywhere else.
========================================================= */

export const queryKeys = {
  health: ["health"] as const,

  findings: (filters: {
    severity?: string;
    status?: string;
    policy_id?: string;
    q?: string;
    limit?: number;
  }) => ["findings", filters] as const,

  finding: (id: number) => ["finding", id] as const,

  findingEvents: (id: number) => ["findingEvents", id] as const,

  assets: (filters: {
    asset_type?: string;
    region?: string;
    q?: string;
  }) => ["assets", filters] as const,

  scans: ["scans"] as const,

  advisor: (findingId: number) => ["advisor", findingId] as const,
};
