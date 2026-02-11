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

  // Build risk map
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

  // Unique types for dropdown
  const uniqueTypes = useMemo(
    () => Array.from(new Set(assets?.map((a) => a.asset_type) ?? [])),
    [assets]
  );

  // Filtered assets
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
    <div style={{ padding: "24px", width: "100%" }}>
      <h2 style={{ marginBottom: "20px", fontSize: "22px", fontWeight: 700 }}>
        Assets
      </h2>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{ padding: "6px 10px" }}
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
          style={{ padding: "6px 10px", minWidth: "200px" }}
        />
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
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
                    padding: "4px 10px",
                    borderRadius: "6px",
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
                      padding: "3px 8px",
                      borderRadius: "12px",
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

      {/* Drawer */}
      <Drawer open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            <div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  marginBottom: "8px",
                }}
              >
                {selected.asset_id}
              </div>

              <span
                style={{
                  backgroundColor: getAssetColor(selected.asset_type),
                  color: "#fff",
                  padding: "5px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                {selected.asset_type}
              </span>
            </div>

            <div style={{ height: "1px", backgroundColor: "#e5e7eb" }} />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "140px 1fr",
                rowGap: "12px",
                columnGap: "12px",
                fontSize: "14px",
              }}
            >
              <div style={{ opacity: 0.6 }}>Region</div>
              <div>{selected.region}</div>

              <div style={{ opacity: 0.6 }}>Name</div>
              <div>{selected.name || "—"}</div>
            </div>

            <div style={{ height: "1px", backgroundColor: "#e5e7eb" }} />

            <div>
              <div
                style={{
                  marginBottom: "12px",
                  fontWeight: 600,
                  fontSize: "15px",
                }}
              >
                Asset Data
              </div>

              <pre
                style={{
                  backgroundColor: "#f3f4f6",
                  padding: "16px",
                  borderRadius: "8px",
                  overflowX: "auto",
                  fontSize: "13px",
                  lineHeight: "1.6",
                  color: "#111827",
                  maxHeight: "400px",
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
