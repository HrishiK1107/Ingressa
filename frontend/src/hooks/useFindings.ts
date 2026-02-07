import { useQuery } from "@tanstack/react-query";
import { fetchFindings } from "../api/fetchers";
import { queryKeys } from "../api/queryKeys";
import type { Finding } from "../api/types";

export interface FindingsFilters {
  severity?: string;
  status?: string;
  policy_id?: string;
  q?: string;
  limit?: number;
}

export function useFindings(filters: FindingsFilters = {}) {
  return useQuery<Finding[]>({
    queryKey: queryKeys.findings(filters),
    queryFn: () => fetchFindings(filters),
    staleTime: 30_000,
  });
}
