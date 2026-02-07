import { apiclient } from "./client";

export const fetchDashboard = async () => {
  const res = await apiclient.get("/dashboard");
  return res.data;
};

export const fetchAssets = async () => {
  const res = await apiclient.get("/assets");
  return res.data;
};

export const fetchFindings = async () => {
  const res = await apiclient.get("/findings");
  return res.data;
};

export const fetchScans = async () => {
  const res = await apiclient.get("/scans");
  return res.data;
};
