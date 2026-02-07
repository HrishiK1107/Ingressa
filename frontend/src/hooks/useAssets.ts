import { useQuery } from "@tanstack/react-query";
import { fetchAssets } from "../api/client";
import { queryKeys } from "../api/queryKeys";

export interface AssetsFilters {
  asset_type?: string;
  region?: string;
  q?: string;
}

export function useAssets(filters?: AssetsFilters) {
  return useQuery({
    queryKey: queryKeys.assets(filters ?? {}),
    queryFn: () => fetchAssets(),
    staleTime: 60_000,
  });
}
