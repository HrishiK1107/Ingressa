import { useQuery } from "@tanstack/react-query";
import { fetchScans } from "../api/client";
import type { ScansResponse } from "../api/types";

export function useScans() {
  return useQuery<ScansResponse>({
    queryKey: ["scans"],
    queryFn: fetchScans,
  });
}
