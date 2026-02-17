import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "../api/client";
import { endpoints } from "../api/endpoints";
import Table from "../components/common/Table";
import Loading from "../components/common/Loading";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import Drawer from "../components/common/Drawer";
import Badge from "../components/common/Badge";
import type { ReactNode } from "react";

interface Scan {
  scan_id: string;
  mode: string;
  status: string;
  started_at: string;
  finished_at: string | null;
  asset_count: number;
  finding_count: number;
  duration_ms: number;
  error_reason: string | null;
}

function useScans() {
  return useQuery({
    queryKey: ["scans"],
    queryFn: async (): Promise<Scan[]> => {
      const res = await api.get(endpoints.scans);
      return res.data.scans || [];
    },
    refetchInterval: (query) =>
      query.state.data?.some((s) => s.status === "RUNNING")
        ? 2000
        : false,
  });
}

function runScan(mode: "mock" | "aws") {
  return api.post(`${endpoints.scans}/run?mode=${mode}`);
}

export default function Scans() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useScans();
  const [selected, setSelected] = useState<Scan | null>(null);

  const runMutation = useMutation({
    mutationFn: (mode: "mock" | "aws") => runScan(mode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scans"] });
    },
  });

  if (isLoading) return <Loading />;
  if (isError) return <ErrorState />;
  if (!data || data.length === 0) return <EmptyState />;

  const isRunning = data.some((s) => s.status === "RUNNING");
  const isMutating = runMutation.isPending;
  const maxDuration = Math.max(...data.map((s) => s.duration_ms || 0)) || 1;

  return (
    <div className="scans-wrapper">
      <h2 className="page-title">Scans</h2>

      <div className="button-row" style={{ marginBottom: "20px" }}>
        <button
          className="modern-btn"
          disabled={isRunning || isMutating}
          onClick={() => runMutation.mutate("mock")}
        >
          {isMutating && runMutation.variables === "mock"
            ? "Starting..."
            : "Run Mock Scan"}
        </button>

        <button
          className="modern-btn"
          disabled={isRunning || isMutating}
          onClick={() => runMutation.mutate("aws")}
        >
          {isMutating && runMutation.variables === "aws"
            ? "Starting..."
            : "Run AWS Scan"}
        </button>
      </div>

      <div className="panel-card">
        <div className="scans-table-wrapper">
        <Table<Scan>
          data={data}
          columns={[
            { header: "Scan ID", accessor: "scan_id" },
            { header: "Mode", accessor: "mode" },
            {
              header: "Status",
              accessor: "status",
              render: (value) => (
                <Badge label={String(value)} variant="status" />
              ),
            },
            { header: "Assets", accessor: "asset_count" },
            { header: "Findings", accessor: "finding_count" },
            {
              header: "Duration",
              accessor: "duration_ms",
              render: (value) => {
                const percent = (Number(value) / maxDuration) * 100;

                return (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <div>
                      {value ? `${Number(value) / 1000}s` : "—"}
                    </div>
                    <div
                      style={{
                        height: "6px",
                        background: "rgba(255,255,255,0.06)",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${percent}%`,
                          background:
                            "linear-gradient(90deg,#334155,#64748b)",
                          transition: "width 0.3s ease",
                        }}
                      />
                    </div>
                  </div>
                );
              },
            },
          ]}
          onRowClick={(row) => setSelected(row)}
        />
        </div>
      </div>

      <Drawer open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "28px",
            }}
          >
            {/* HEADER */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 600,
                  wordBreak: "break-all",
                }}
              >
                {selected.scan_id}
              </div>
              <Badge label={selected.status} variant="status" />
            </div>

            {/* OVERVIEW */}
            <Section title="SCAN OVERVIEW">
              <Meta label="Mode" value={selected.mode} />
              <Meta
                label="Started"
                value={new Date(selected.started_at).toLocaleString()}
              />
              <Meta
                label="Finished"
                value={
                  selected.finished_at
                    ? new Date(selected.finished_at).toLocaleString()
                    : "—"
                }
              />
            </Section>

            {/* METRICS */}
            <Section title="METRICS">
              <Meta label="Assets" value={selected.asset_count} />
              <Meta label="Findings" value={selected.finding_count} />
              <Meta
                label="Duration"
                value={
                  selected.duration_ms
                    ? `${selected.duration_ms / 1000}s`
                    : "—"
                }
              />
            </Section>

            {/* ERROR */}
            <Section title="ERROR">
              <div
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.04)",
                  fontSize: "14px",
                  wordBreak: "break-word",
                }}
              >
                {selected.error_reason || "No errors reported."}
              </div>
            </Section>
          </div>
        )}
      </Drawer>
    </div>
  );
}

type MetaProps = {
  label: string;
  value: ReactNode;
};

function Meta({ label, value }: MetaProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: "14px",
        padding: "6px 0",
      }}
    >
      <div style={{ color: "var(--text-secondary)" }}>{label}</div>
      <div style={{ fontWeight: 500 }}>{value}</div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div
        style={{
          fontSize: "12px",
          letterSpacing: "1px",
          fontWeight: 600,
          color: "var(--text-secondary)",
        }}
      >
        {title}
      </div>

      <div
        style={{
          borderTop: "1px solid var(--border)",
          paddingTop: "12px",
        }}
      >
        {children}
      </div>
    </div>
  );
}
