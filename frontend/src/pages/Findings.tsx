import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import { endpoints } from "../api/endpoints";
import type { Finding, FindingEvent } from "../api/types";
import Table from "../components/common/Table";
import Loading from "../components/common/Loading";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import Drawer from "../components/common/Drawer";
import Badge from "../components/common/Badge";
import { useQueryParams } from "../hooks/useQueryParams";

function useFindings(filters: {
  severity?: string;
  status?: string;
  policy_id?: string;
  q?: string;
  limit?: string;
}) {
  return useQuery({
    queryKey: ["findings", filters],
    queryFn: async (): Promise<Finding[]> => {
      const params: Record<string, string> = {};

      if (filters.severity) params.severity = filters.severity;
      if (filters.status) params.status = filters.status;
      if (filters.policy_id) params.policy_id = filters.policy_id;
      if (filters.q) params.q = filters.q;
      if (filters.limit) params.limit = filters.limit;

      const res = await api.get(endpoints.findings, { params });
      return res.data;
    },
  });
}

function useFindingDetail(id?: number) {
  return useQuery({
    queryKey: ["finding", id],
    queryFn: async (): Promise<Finding> => {
      const res = await api.get(`${endpoints.findings}/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

function useFindingEvents(id?: number) {
  return useQuery({
    queryKey: ["findingEvents", id],
    queryFn: async (): Promise<FindingEvent[]> => {
      const res = await api.get(`${endpoints.findings}/${id}/events`);
      return res.data;
    },
    enabled: !!id,
  });
}

export default function Findings() {
  const { get, set } = useQueryParams();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const severity = get("severity");
  const status = get("status");
  const policy_id = get("policy_id");
  const q = get("q");
  const limit = get("limit") || "200";

  const { data, isLoading, isError } = useFindings({
    severity,
    status,
    policy_id,
    q,
    limit,
  });

  const { data: detail } = useFindingDetail(selectedId || undefined);
  const { data: events } = useFindingEvents(selectedId || undefined);

  if (isLoading) return <Loading />;
  if (isError) return <ErrorState />;
  if (!data || data.length === 0) return <EmptyState />;

  return (
    <div>
      <h2 style={{ marginBottom: "16px" }}>Findings</h2>

      {/* Filters */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "12px" }}>
        <select value={severity} onChange={(e) => set("severity", e.target.value)}>
          <option value="">All Severities</option>
          <option value="CRITICAL">CRITICAL</option>
          <option value="HIGH">HIGH</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="LOW">LOW</option>
        </select>

        <select value={status} onChange={(e) => set("status", e.target.value)}>
          <option value="">All Status</option>
          <option value="OPEN">OPEN</option>
          <option value="RESOLVED">RESOLVED</option>
        </select>

        <input
          placeholder="Search resource_id"
          value={q}
          onChange={(e) => set("q", e.target.value)}
        />

        <input
          type="number"
          min="1"
          max="500"
          value={limit}
          onChange={(e) => set("limit", e.target.value)}
          style={{ width: "90px" }}
        />
      </div>

      {/* Table */}
      <Table<Finding>
        data={data}
        columns={[
          {
            header: "Severity",
            accessor: "severity",
            render: (value) => (
              <Badge label={String(value)} variant="severity" />
            ),
          },
          { header: "Risk", accessor: "risk_score" },
          { header: "Policy", accessor: "policy_id" },
          { header: "Resource Type", accessor: "resource_type" },
          { header: "Resource ID", accessor: "resource_id" },
          { header: "Region", accessor: "region" },
          {
            header: "Status",
            accessor: "status",
            render: (value) => (
              <Badge label={String(value)} variant="status" />
            ),
          },
          { header: "Last Seen", accessor: "last_seen" },
        ]}
        onRowClick={(row) => setSelectedId(row.finding_id)}
      />

      {/* Drawer */}
      <Drawer open={!!selectedId} onClose={() => setSelectedId(null)}>
        {!detail && <Loading />}

        {detail && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "28px",
              borderLeft: `4px solid ${
                detail.severity === "CRITICAL"
                  ? "#dc2626"
                  : detail.severity === "HIGH"
                  ? "#ea580c"
                  : detail.severity === "MEDIUM"
                  ? "#d97706"
                  : "#16a34a"
              }`,
              paddingLeft: "16px",
            }}
          >
            {/* Header */}
            <div>
              <div style={{ fontSize: "20px", fontWeight: 600 }}>
                {detail.policy_id}
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                <Badge label={detail.severity} variant="severity" />
                <Badge label={detail.status} variant="status" />
              </div>
            </div>

            {/* Metadata */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "120px 1fr",
                rowGap: "10px",
                columnGap: "12px",
                fontSize: "14px",
              }}
            >
              <div style={{ color: "#6b7280" }}>Risk Score</div>
              <div>{detail.risk_score}</div>

              <div style={{ color: "#6b7280" }}>Resource</div>
              <div>
                {detail.resource_type} / {detail.resource_id}
              </div>

              <div style={{ color: "#6b7280" }}>Region</div>
              <div>{detail.region}</div>

              <div style={{ color: "#6b7280" }}>First Seen</div>
              <div>
                {detail.first_seen
                  ? new Date(detail.first_seen).toLocaleString()
                  : "—"}
              </div>

              <div style={{ color: "#6b7280" }}>Last Seen</div>
              <div>
                {detail.last_seen
                  ? new Date(detail.last_seen).toLocaleString()
                  : "—"}
              </div>
            </div>

            <div style={{ height: "1px", backgroundColor: "#e5e7eb" }} />

            {/* Timeline */}
            <div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  marginBottom: "16px",
                }}
              >
                Timeline
              </div>

              {!events && <Loading />}

              {events && events.length === 0 && (
                <div style={{ color: "#6b7280" }}>No events recorded.</div>
              )}

              {events && events.length > 0 && (
                <div style={{ position: "relative", paddingLeft: "18px" }}>
                  <div
                    style={{
                      position: "absolute",
                      left: "6px",
                      top: 0,
                      bottom: 0,
                      width: "2px",
                      backgroundColor: "#e5e7eb",
                    }}
                  />

                  <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                    {events.map((e, i) => {
                      const safeDate =
                        (e as unknown as Record<string, unknown>).timestamp ||
                        (e as unknown as Record<string, unknown>).created_at ||
                        (e as unknown as Record<string, unknown>).event_time;

                      return (
                        <div
                          key={i}
                          style={{
                            position: "relative",
                            padding: "14px",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            backgroundColor: "#f9fafb",
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              left: "-20px",
                              top: "22px",
                              width: "10px",
                              height: "10px",
                              backgroundColor:
                                detail.severity === "CRITICAL"
                                ? "#dc2626"
                                : detail.severity === "HIGH"
                                ? "#ea580c"
                                : detail.severity === "MEDIUM"
                                ? "#d97706"
                                : "#16a34a",
                              borderRadius: "50%",
                            }}
                          />

                          <div style={{ marginBottom: "6px" }}>
                            <Badge label={e.event_type} />
                          </div>

                          <div style={{ fontSize: "12px", color: "#6b7280" }}>
                            {safeDate
                              ? new Date(safeDate as string | number).toLocaleString()
                              : "—"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
