import { useQuery } from "@tanstack/react-query";
import { fetchScans } from "../api/client";
import { queryKeys } from "../api/queryKeys";
import type { ScansResponse } from "../api/types";

export function useScans() {
  return useQuery<ScansResponse>({
    queryKey: queryKeys.scans,
    queryFn: fetchScans,
    staleTime: 15_000,
  });
}
