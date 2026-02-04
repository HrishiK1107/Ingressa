import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";
import type { ScanRun } from "./types";

export async function runScan(mode: "mock" | "aws"): Promise<ScanRun> {
  const res = await apiClient.post(ENDPOINTS.scanRun(mode));
  return res.data as ScanRun;
}

export async function getScans(): Promise<ScanRun[]> {
  const res = await apiClient.get(ENDPOINTS.scans());
  return res.data as ScanRun[];
}
