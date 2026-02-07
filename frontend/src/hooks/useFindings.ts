import { useQuery } from "@tanstack/react-query";
import { fetchFindings } from "../api/client";
import type { Finding } from "../api/types";

export function useFindings() {
  return useQuery<Finding[]>({
    queryKey: ["findings"],
    queryFn: fetchFindings,
  });
}
