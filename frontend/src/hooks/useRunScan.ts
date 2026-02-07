import { useMutation, useQueryClient } from "@tanstack/react-query";
import { runScan } from "../api/client";
import { queryKeys } from "../api/queryKeys";

export function useRunScan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mode: "mock" | "aws") => runScan(mode),

    onSuccess: () => {
      // 🔁 mandatory invalidations
      queryClient.invalidateQueries({ queryKey: queryKeys.findings({}) });
      queryClient.invalidateQueries({ queryKey: queryKeys.assets({}) });
      queryClient.invalidateQueries({ queryKey: queryKeys.scans });
    },
  });
}
