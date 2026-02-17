import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import { endpoints } from "../api/endpoints";
import Table from "../components/common/Table";
import Loading from "../components/common/Loading";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import Drawer from "../components/common/Drawer";

interface Asset {
  asset_id: string;
  asset_type: string;
  region: string;
  name: string | null;
  data: Record<string, unknown>;
}

interface Finding {
  resource_id: string;
  severity: string;
  status: string;
}

function useAssets() {
  return useQuery({
    queryKey: ["assets"],
    queryFn: async (): Promise<Asset[]> => {
      const res = await api.get(endpoints.assets);
      return res.data;
    },
  });
}

function useFindings() {
  return useQuery({
    queryKey: ["findings"],
    queryFn: async (): Promise<Finding[]> => {
      const res = await api.get(endpoints.findings);
      return res.data;
    },
  });
}

function getAssetColor(type: string) {
  switch (type) {
    case "ec2":
      return "#2563eb";
    case "s3":
      return "#d97706";
    case "iam_user":
    case "iam_role":
      return "#7c3aed";
    case "security_group":
      return "#dc2626";
    case "cloudtrail":
      return "#0d9488";
    default:
      return "#64748b";
  }
}

export default function Assets() {
  const { data: assets, isLoading, isError } = useAssets();
  const { data: findings } = useFindings();

  const [selected, setSelected] = useState<Asset | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const riskMap = useMemo(() => {
    const map: Record<string, number> = {};
    if (!findings) return map;

    findings.forEach((f) => {
      if (f.status === "OPEN") {
        map[f.resource_id] = (map[f.resource_id] || 0) + 1;
      }
    });

    return map;
  }, [findings]);

  const uniqueTypes = useMemo(
    () => Array.from(new Set(assets?.map((a) => a.asset_type) ?? [])),
    [assets]
  );

  const filteredAssets = useMemo(() => {
    if (!assets) return [];
    return assets.filter((a) => {
      const matchesType = typeFilter ? a.asset_type === typeFilter : true;
      const matchesSearch = search
        ? a.asset_id.toLowerCase().includes(search.toLowerCase())
        : true;

      return matchesType && matchesSearch;
    });
  }, [assets, typeFilter, search]);

  if (isLoading) return <Loading />;
  if (isError) return <ErrorState />;
  if (!assets || assets.length === 0) return <EmptyState />;

  return (
    <div className="findings-layout">
      {/* HEADER */}
      <div className="findings-header">
        <h2 className="page-title">Assets</h2>

        <div className="findings-filters">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <input
            placeholder="Search by asset_id"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE WRAPPER */}
      <div className="findings-table-wrapper">
        <Table<Asset>
          data={filteredAssets}
          columns={[
            { header: "Asset ID", accessor: "asset_id" },
            {
              header: "Type",
              accessor: "asset_type",
              render: (value) => (
                <span
                  style={{
                    backgroundColor: getAssetColor(String(value)),
                    color: "#fff",
                    padding: "4px 12px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  {String(value)}
                </span>
              ),
            },
            { header: "Region", accessor: "region" },
            {
              header: "Risk (Open)",
              accessor: "asset_id",
              render: (value) => {
                const count = riskMap[String(value)] || 0;

                return count > 0 ? (
                  <span
                    style={{
                      backgroundColor: "#dc2626",
                      color: "#fff",
                      padding: "4px 10px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    {count}
                  </span>
                ) : (
                  "—"
                );
              },
            },
            {
              header: "Name",
              accessor: "name",
              render: (value) => String(value || "—"),
            },
          ]}
          onRowClick={(row) => setSelected(row)}
        />
      </div>

      {/* DRAWER */}
      <Drawer open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div className="drawer-panel">
            <div className="drawer-header">
              <div className="drawer-title">{selected.asset_id}</div>

              <span
                style={{
                  backgroundColor: getAssetColor(selected.asset_type),
                  color: "#fff",
                  padding: "5px 12px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 600,
                  width: "fit-content",
                }}
              >
                {selected.asset_type}
              </span>
            </div>

            <div className="drawer-section">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "140px 1fr",
                  rowGap: "14px",
                  columnGap: "12px",
                }}
              >
                <div style={{ color: "var(--text-secondary)" }}>Region</div>
                <div>{selected.region}</div>

                <div style={{ color: "var(--text-secondary)" }}>Name</div>
                <div>{selected.name || "—"}</div>
              </div>
            </div>

            <div className="drawer-section">
              <h4>Asset Data</h4>

              <pre
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--border)",
                  borderRadius: "14px",
                  padding: "18px",
                  overflowX: "auto",
                  fontSize: "13px",
                  lineHeight: "1.6",
                  color: "var(--text-primary)",
                  maxHeight: "420px",
                }}
              >
                {JSON.stringify(selected.data, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
