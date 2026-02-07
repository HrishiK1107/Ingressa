import { useState } from "react";
import { useFindings } from "../hooks/useFindings";
import { FindingsTable } from "../components/console/FindingsTable";
import { FindingDrawer } from "../components/console/FindingDrawer";
import type { Finding } from "../api/types";

export default function Findings() {
  const { data, isLoading, isError } = useFindings();
  const [selected, setSelected] = useState<Finding | null>(null);

  if (isLoading) return <div>Loading…</div>;
  if (isError) return <div>Error</div>;
  if (!data || data.length === 0) return <div>No findings</div>;

  return (
    <div>
      <h1>Findings</h1>

      <FindingsTable
        items={data}
        onSelect={(f) => setSelected(f)}
      />

      <FindingDrawer
        finding={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
