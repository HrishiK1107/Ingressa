import { useState } from "react";
import type { Finding } from "../../api/types";
import { Table } from "../ui/Table";
import { Badge } from "../ui/Badge";
import { formatDate } from "../../utils/format";

type SortKey = "severity" | "risk_score" | "last_seen";
type SortDir = "asc" | "desc";

interface Props {
  items: Finding[];
  onSelect: (finding: Finding) => void;
}

export function FindingsTable({ items, onSelect }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("risk_score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sortedItems = [...items].sort((a, b) => {
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
      onRowClick={onSelect}
      columns={[
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
          header: "Risk Score",
          sortable: true,
          onSort: () => handleSort("risk_score"),
          render: (f) => f.risk_score.toFixed(1),
        },
        {
          key: "policy_id",
          header: "Policy ID",
          render: (f) => f.policy_id,
        },
        {
          key: "resource_type",
          header: "Resource Type",
          render: (f) => f.resource_type,
        },
        {
          key: "resource_id",
          header: "Resource ID",
          render: (f) => f.resource_id,
        },
        {
          key: "region",
          header: "Region",
          render: (f) => f.region ?? "global",
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
          key: "first_seen",
          header: "First Seen",
          render: (f) => formatDate(f.first_seen),
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
