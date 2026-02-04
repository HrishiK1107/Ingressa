import { useMutation, useQueryClient } from "@tanstack/react-query";
import { runScan } from "../api/scans";
import { queryKeys } from "../api/queryKeys";

export default function useRunScan() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (mode: "mock" | "aws") => runScan(mode),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: queryKeys.findings({}) }),
        qc.invalidateQueries({ queryKey: queryKeys.assets({}) }),
        qc.invalidateQueries({ queryKey: queryKeys.scans() }),
      ]);
    },
  });
}
