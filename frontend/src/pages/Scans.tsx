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

  const maxDuration =
    Math.max(...data.map((s) => s.duration_ms || 0)) || 1;

  return (
    <div style={{ padding: "24px" }}>
      <h2 style={{ marginBottom: "20px" }}>Scans</h2>

      {/* Run Buttons */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <button
          disabled={isRunning || isMutating}
          onClick={() => runMutation.mutate("mock")}
          style={{
            padding: "10px 18px",
            backgroundColor:
              isRunning || isMutating ? "#94a3b8" : "#3b82f6",
            color: "#ffffff",
            border: "none",
            borderRadius: "6px",
            cursor:
              isRunning || isMutating ? "not-allowed" : "pointer",
            fontWeight: 600,
            opacity: isRunning || isMutating ? 0.7 : 1,
            transition: "all 0.2s ease",
          }}
        >
          {isMutating && runMutation.variables === "mock"
            ? "Starting..."
            : "Run Mock Scan"}
        </button>

        <button
          disabled={isRunning || isMutating}
          onClick={() => runMutation.mutate("aws")}
          style={{
            padding: "10px 18px",
            backgroundColor:
              isRunning || isMutating ? "#94a3b8" : "#0ea5e9",
            color: "#ffffff",
            border: "none",
            borderRadius: "6px",
            cursor:
              isRunning || isMutating ? "not-allowed" : "pointer",
            fontWeight: 600,
            opacity: isRunning || isMutating ? 0.7 : 1,
            transition: "all 0.2s ease",
          }}
        >
          {isMutating && runMutation.variables === "aws"
            ? "Starting..."
            : "Run AWS Scan"}
        </button>
      </div>

      {/* Table */}
      <Table<Scan>
        data={data}
        columns={[
          { header: "Scan ID", accessor: "scan_id" },
          { header: "Mode", accessor: "mode" },
          {
            header: "Status",
            accessor: "status",
            render: (value) => (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {value === "RUNNING" && (
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "#f59e0b",
                      animation: "pulse 1.2s infinite",
                    }}
                  />
                )}
                <Badge label={String(value)} variant="status" />
              </div>
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
                <div style={{ minWidth: 120 }}>
                  <div style={{ fontSize: 12, marginBottom: 4 }}>
                    {value ? `${Number(value) / 1000}s` : "—"}
                  </div>
                  <div
                    style={{
                      height: 6,
                      backgroundColor: "#e5e7eb",
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${percent}%`,
                        height: "100%",
                        backgroundColor: "#3b82f6",
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

      {/* Drawer */}
      <Drawer open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <div style={{ fontSize: "20px", fontWeight: 700 }}>
                {selected.scan_id}
              </div>
              <div style={{ marginTop: "8px" }}>
                <Badge label={selected.status} variant="status" />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "140px 1fr",
                rowGap: "10px",
                columnGap: "12px",
              }}
            >
              <div style={{ opacity: 0.6 }}>Mode</div>
              <div>{selected.mode}</div>

              <div style={{ opacity: 0.6 }}>Started</div>
              <div>{new Date(selected.started_at).toLocaleString()}</div>

              <div style={{ opacity: 0.6 }}>Finished</div>
              <div>
                {selected.finished_at
                  ? new Date(selected.finished_at).toLocaleString()
                  : "—"}
              </div>

              <div style={{ opacity: 0.6 }}>Assets</div>
              <div>{selected.asset_count}</div>

              <div style={{ opacity: 0.6 }}>Findings</div>
              <div>{selected.finding_count}</div>

              <div style={{ opacity: 0.6 }}>Duration</div>
              <div>
                {selected.duration_ms
                  ? `${selected.duration_ms / 1000}s`
                  : "—"}
              </div>

              <div style={{ opacity: 0.6 }}>Error</div>
              <div>{selected.error_reason || "—"}</div>
            </div>
          </div>
        )}
      </Drawer>

      <style>
        {`
          @keyframes pulse {
            0% { opacity: 0.3; }
            50% { opacity: 1; }
            100% { opacity: 0.3; }
          }
        `}
      </style>
    </div>
  );
}
