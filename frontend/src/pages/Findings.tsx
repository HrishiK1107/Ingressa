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

type EventWithOptionalTime = FindingEvent & {
  timestamp?: string | number;
  created_at?: string | number;
  event_time?: string | number;
};

interface AdvisorResponse {
  summary: string;
  risk_assessment: {
    score: number;
    bucket: string | null;
    explanation: Record<string, unknown>;
  };
  attack_narrative: string;
  impact: string;
  recommended_action: string;
  metadata: {
    policy_id: string;
    resource_type: string;
    resource_id: string;
    region: string;
    status: string;
  };
}

/* ================= Hooks ================= */

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

function useAdvisor(id?: number) {
  return useQuery({
    queryKey: ["advisor", id],
    queryFn: async (): Promise<AdvisorResponse> => {
      const res = await api.get(`/ai/explain/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

/* ================= Component ================= */

export default function Findings() {
  const { get, set } = useQueryParams();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showAllEvents, setShowAllEvents] = useState(false);

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

  const {
    data: advisor,
    isLoading: advisorLoading,
    isError: advisorError,
  } = useAdvisor(selectedId || undefined);

  if (isLoading) return <Loading />;
  if (isError) return <ErrorState />;
  if (!data || data.length === 0) return <EmptyState />;

  return (
    <div className="findings-layout">
      {/* Header */}
      <div className="findings-header">
        <h2 className="page-title">Findings</h2>

        <div className="findings-filters">
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
          />
        </div>
      </div>

      {/* Table */}
      <div className="findings-table-wrapper">
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
          onRowClick={(row) => {
            setSelectedId(row.finding_id);
            setShowAllEvents(false);
          }}
        />
      </div>

      {/* Drawer */}
      <Drawer open={!!selectedId} onClose={() => setSelectedId(null)}>
        {!detail && <Loading />}

        {detail && (
          <div
            className="drawer-panel"
            style={{
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
            <div className="drawer-header">
              <div className="drawer-title">{detail.policy_id}</div>
              <div style={{ display: "flex", gap: "8px" }}>
                <Badge label={detail.severity} variant="severity" />
                <Badge label={detail.status} variant="status" />
              </div>
            </div>

            {/* AI Advisor */}
            <div className="drawer-section">
              <h4>AI Advisor</h4>

              {advisorLoading && <Loading />}
              {advisorError && <div>Error loading advisor.</div>}

              {advisor && (
                <>
                  <div><strong>Summary:</strong><div>{advisor.summary}</div></div>
                  <div><strong>Risk Score:</strong><div>{advisor.risk_assessment.score}</div></div>
                  <div><strong>Attack Narrative:</strong><div>{advisor.attack_narrative}</div></div>
                  <div><strong>Impact:</strong><div>{advisor.impact}</div></div>
                  <div><strong>Recommended Action:</strong><div>{advisor.recommended_action}</div></div>
                </>
              )}
            </div>

            {/* Timeline */}
            <div className="drawer-section">
              <h4>Timeline</h4>

              {events &&
                (showAllEvents ? events : events.slice(0, 5)).map((e, i) => {
                  const event = e as EventWithOptionalTime;
                  const safeDate =
                    event.timestamp ??
                    event.created_at ??
                    event.event_time;

                  return (
                    <div key={i} className="timeline-item">
                      <Badge label={e.event_type} />
                      <div style={{ fontSize: 12, marginTop: 4 }}>
                        {safeDate
                          ? new Date(safeDate).toLocaleString()
                          : "—"}
                      </div>
                    </div>
                  );
                })}

              {events && events.length > 5 && (
                <button
                  onClick={() => setShowAllEvents((p) => !p)}
                  style={{
                    marginTop: "10px",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  {showAllEvents ? "Show Less" : `Show All (${events.length})`}
                </button>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
