import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../api/queryKeys";
import { fetchDashboard } from "../api/fetchers";

export const useDashboard = () =>
  useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: fetchDashboard,
  });
