import { apiclient } from "./client";
import { ENDPOINTS } from "./endpoints";
import type { Finding } from "./types";
import type { FindingEvent } from "./types";

export const fetchDashboard = async () => {
  const res = await apiclient.get("/dashboard");
  return res.data;
};

export const fetchAssets = async () => {
  const res = await apiclient.get("/assets");
  return res.data;
};

export const fetchFindings = async (params?: {
  severity?: string;
  status?: string;
  policy_id?: string;
  q?: string;
  limit?: number;
}): Promise<Finding[]> => {
  const res = await apiclient.get<Finding[]>(
    ENDPOINTS.findings(params)
  );
  return res.data;
};

export const fetchScans = async () => {
  const res = await apiclient.get("/scans");
  return res.data;
};

export const fetchFindingEvents = async (
  findingId: number
): Promise<FindingEvent[]> => {
  const res = await apiclient.get<FindingEvent[]>(
    ENDPOINTS.findingEvents(String(findingId))
  );
  return res.data;
};
