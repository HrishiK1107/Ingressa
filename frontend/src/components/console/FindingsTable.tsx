import { useState } from "react";
import type { Finding } from "../../api/types";
import { Table } from "../ui/Table";
import { Badge } from "../ui/Badge";
import { formatDate } from "../../utils/format";

type SortKey = "risk_score" | "severity" | "last_seen";
type SortDir = "asc" | "desc";

interface Props {
  items: Finding[];
  onSelect: (finding: Finding) => void;
}

export function FindingsTable({ items, onSelect }: Props) {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sortedItems = [...items].sort((a, b) => {
    if (!sortKey) return 0;

    let av: any = a[sortKey];
    let bv: any = b[sortKey];

    if (sortKey === "last_seen") {
      av = new Date(av).getTime();
      bv = new Date(bv).getTime();
    }

    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  function handleSort(key: SortKey) {
    const nextDir =
      sortKey === key && sortDir === "desc" ? "asc" : "desc";

    setSortKey(key);
    setSortDir(nextDir);
  }

  return (
    <Table
      data={sortedItems}
      onRowClick={(f) => onSelect(f)}
      columns={[
        {
          key: "finding_id",
          header: "ID",
          render: (f) => f.finding_id,
        },
        {
          key: "severity",
          header: "Severity",
          sortable: true,
          onSort: () => handleSort("severity"),
          render: (f) => (
            <Badge variant={f.severity.toLowerCase() as any}>
              {f.severity}
            </Badge>
          ),
        },
        {
          key: "risk_score",
          header: "Risk",
          sortable: true,
          onSort: () => handleSort("risk_score"),
          render: (f) => f.risk_score.toFixed(1),
        },
        {
          key: "status",
          header: "Status",
          render: (f) => (
            <Badge variant={f.status.toLowerCase() as any}>
              {f.status}
            </Badge>
          ),
        },
        {
          key: "last_seen",
          header: "Last Seen",
          sortable: true,
          onSort: () => handleSort("last_seen"),
          render: (f) => formatDate(f.last_seen),
        },
      ]}
    />
  );
}
