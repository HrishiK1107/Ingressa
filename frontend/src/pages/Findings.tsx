import { useState } from "react";
import { useFindings } from "../hooks/useFindings";
import { FindingsTable } from "../components/console/FindingsTable";
import { FindingDrawer } from "../components/console/FindingDrawer";
import { ErrorBox } from "../components/ui/ErrorBox";
import { Loading } from "../components/ui/Loading";
import { EmptyState } from "../components/ui/EmptyState";
import type { Finding } from "../api/types";

export default function Findings() {
  const [selected, setSelected] = useState<Finding | null>(null);

  const [severity, setSeverity] = useState("");
  const [status, setStatus] = useState("");
  const [policyId, setPolicyId] = useState("");
  const [query, setQuery] = useState("");

  const { data, isLoading, isError, refetch } = useFindings({
    severity: severity || undefined,
    status: status || undefined,
    policy_id: policyId || undefined,
    q: query || undefined,
  });

  if (isLoading) return <Loading />;

  if (isError) {
    return (
      <ErrorBox
        title="Failed to load findings"
        message="Unable to fetch findings from the server."
        actionLabel="Retry"
        onAction={refetch}
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        title="No findings"
        message="Your environment is clean or nothing has been scanned yet."
      />
    );
  }

  return (
    <div className="flex h-full">
      {/* LEFT */}
      <div
        className={`transition-all duration-200 ${
          selected ? "w-[calc(100%-420px)]" : "w-full"
        }`}
      >
        <h1 className="mb-4 text-xl font-semibold">Findings</h1>

        {/* FILTER BAR */}
        <div className="mb-4 flex flex-wrap gap-2">
          <select
            className="border border-border bg-background px-2 py-1 text-sm"
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
          >
            <option value="">All Severities</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>

          <select
            className="border border-border bg-background px-2 py-1 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="OPEN">OPEN</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>

          <input
            className="border border-border bg-background px-2 py-1 text-sm"
            placeholder="Policy ID"
            value={policyId}
            onChange={(e) => setPolicyId(e.target.value)}
          />

          <input
            className="border border-border bg-background px-2 py-1 text-sm"
            placeholder="Resource search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <FindingsTable
          items={data}
          onSelect={(f) => setSelected(f)}
        />
      </div>

      {/* RIGHT */}
      {selected && (
        <div className="w-[420px] border-l border-border">
          <FindingDrawer
            finding={selected}
            onClose={() => setSelected(null)}
          />
        </div>
      )}
    </div>
  );
}
