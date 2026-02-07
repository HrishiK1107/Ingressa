import { useQuery } from "@tanstack/react-query";
import { fetchAssets } from "../api/client";

export function useAssets() {
  return useQuery({
    queryKey: ["assets"],
    queryFn: fetchAssets,
  });
}
