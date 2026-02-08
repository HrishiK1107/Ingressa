import { useQuery } from "@tanstack/react-query";
import { fetchAssets } from "../api/fetchers";
import { queryKeys } from "../api/queryKeys";
import type { AssetsResponse } from "../api/types";

export interface AssetsFilters {
  asset_type?: string;
  region?: string;
  q?: string;
}

export function useAssets(filters: AssetsFilters = {}) {
  return useQuery<AssetsResponse>({
    queryKey: queryKeys.assets(filters),
    queryFn: fetchAssets,
    staleTime: 60_000,
  });
}
