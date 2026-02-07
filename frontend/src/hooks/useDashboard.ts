import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../api/queryKeys";
import { apiclient } from "../api/client";

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: async () => {
      const res = await apiclient.get("/health");
      return res.data;
    },
    staleTime: 10_000,
  });
}
