import axios from "axios";

import { ENDPOINTS } from "./endpoints";
import type {
  AssetsResponse,
  FindingsResponse,
  ScansResponse,
} from "./types";

/**
 * Axios client instance
 */
export const apiclient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Response interceptor (normalize errors)
 */
apiclient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject({
      status: error?.response?.status ?? 0,
      message:
        error?.response?.data?.detail ??
        error?.message ??
        "Unknown API error",
    });
  }
);

/* ---------------- Assets ---------------- */
export async function fetchAssets(): Promise<AssetsResponse> {
  const res = await apiclient.get<AssetsResponse>(ENDPOINTS.ASSETS);
  return res.data;
}

/* ---------------- Findings ---------------- */
export async function fetchFindings(): Promise<FindingsResponse> {
  const res = await apiclient.get<FindingsResponse>(ENDPOINTS.FINDINGS);
  return res.data;
}

/* ---------------- Scans ---------------- */
export async function fetchScans(): Promise<ScansResponse> {
  const res = await apiclient.get<ScansResponse>(ENDPOINTS.SCANS);
  return res.data;
}
