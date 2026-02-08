import { useQuery } from "@tanstack/react-query";
import { fetchFindingEvents } from "../api/fetchers";
import type { FindingEvent } from "../api/types";

export function useFindingEvents(findingId?: number) {
  return useQuery<FindingEvent[]>({
    queryKey: ["finding-events", findingId],
    queryFn: () => fetchFindingEvents(findingId as number),
    enabled: !!findingId,
    staleTime: 30_000,
  });
}
