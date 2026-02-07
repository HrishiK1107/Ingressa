import { useState } from "react";
import { useFindings } from "../hooks/useFindings";
import { FindingsTable } from "../components/console/FindingsTable";
import { FindingDrawer } from "../components/console/FindingDrawer";
import { ErrorBox } from "../components/ui/ErrorBox";
import { Loading } from "../components/ui/Loading";
import { EmptyState } from "../components/ui/EmptyState";
import type { Finding } from "../api/types";

export default function Findings() {
  const { data, isLoading, isError, refetch } = useFindings();
  const [selected, setSelected] = useState<Finding | null>(null);

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
      {/* LEFT: TABLE */}
      <div
        className={`transition-all duration-200 ${
          selected ? "w-[calc(100%-420px)]" : "w-full"
        }`}
      >
        <h1 className="mb-4 text-xl font-semibold">Findings</h1>

        <FindingsTable
          items={data}
          onSelect={(f) => setSelected(f)}
        />
      </div>

      {/* RIGHT: DRAWER */}
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
