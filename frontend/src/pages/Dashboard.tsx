import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { endpoints } from "../api/endpoints";
import Loading from "../components/common/Loading";
import ErrorState from "../components/common/ErrorState";
import Badge from "../components/common/Badge";

interface Asset {
  asset_id: string;
}

interface Finding {
  resource_id: string;
  severity: string;
  status: string;
}

interface Scan {
  scan_id: string;
  status: string;
  duration_ms: number;
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

export default function Dashboard() {
  const navigate = useNavigate();

  const { data: assets, isLoading: aL, isError: aE } = useAssets();
  const { data: findings, isLoading: fL, isError: fE } = useFindings();
  const { data: scans, isLoading: sL, isError: sE } = useScans();

  if (aL || fL || sL) return <Loading />;
  if (aE || fE || sE) return <ErrorState />;
  if (!assets || !findings || !scans) return null;

  const openFindings = findings.filter(f => f.status === "OPEN");

  const critical = openFindings.filter(f => f.severity === "CRITICAL").length;
  const high = openFindings.filter(f => f.severity === "HIGH").length;
  const medium = openFindings.filter(f => f.severity === "MEDIUM").length;
  const low = openFindings.filter(f => f.severity === "LOW").length;

  const totalAssets = assets.length;
  const openCount = openFindings.length;

  const riskyAssetsMap: Record<string, number> = {};

  openFindings.forEach(f => {
    riskyAssetsMap[f.resource_id] =
      (riskyAssetsMap[f.resource_id] || 0) + 1;
  });

  const riskyAssetCount = Object.keys(riskyAssetsMap).length;

  const exposurePercent =
    totalAssets > 0
      ? ((riskyAssetCount / totalAssets) * 100).toFixed(0)
      : "0";

  const topRiskyAssets = Object.entries(riskyAssetsMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const lastScan = scans[0];

  const weights = { CRITICAL: 5, HIGH: 3, MEDIUM: 2, LOW: 1 };

  const weightedScore =
    critical * weights.CRITICAL +
    high * weights.HIGH +
    medium * weights.MEDIUM +
    low * weights.LOW;

  const riskIndex =
    totalAssets > 0
      ? (weightedScore / totalAssets).toFixed(2)
      : "0";

  const maxPossibleScore = totalAssets * weights.CRITICAL;
  const riskPercent =
    maxPossibleScore > 0
      ? (weightedScore / maxPossibleScore) * 100
      : 0;

  const cardStyle: React.CSSProperties = {
    padding: "20px",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    minWidth: 220,
  };

  const cardLabel: React.CSSProperties = {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 6,
  };

  const cardValue: React.CSSProperties = {
    fontSize: 26,
    fontWeight: 700,
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 24 }}>Dashboard</h2>

      {/* === Stat Cards === */}
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <div style={cardStyle}>
          <div style={cardLabel}>Total Assets</div>
          <div style={cardValue}>{totalAssets}</div>
        </div>

        <div style={cardStyle}>
          <div style={cardLabel}>Open Findings</div>
          <div style={cardValue}>{openCount}</div>
        </div>

        <div style={cardStyle}>
          <div style={cardLabel}>Critical Findings</div>
          <div style={cardValue}>{critical}</div>
        </div>

        <div style={cardStyle}>
          <div style={cardLabel}>Risk Index</div>
          <div style={cardValue}>{riskIndex}</div>

          {/* Risk Meter */}
          <div
            style={{
              height: 6,
              marginTop: 10,
              background: "#e5e7eb",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${riskPercent}%`,
                height: "100%",
                background: "#ef4444",
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>
      </div>

      {/* === Severity Distribution Bar === */}
      <div style={{ marginTop: 30 }}>
        <div style={{ fontWeight: 600, marginBottom: 10 }}>
          Severity Distribution
        </div>

        <div style={{ display: "flex", gap: 20 }}>
          {[
            { label: "CRITICAL", value: critical },
            { label: "HIGH", value: high },
            { label: "MEDIUM", value: medium },
            { label: "LOW", value: low },
          ].map(item => (
            <div
              key={item.label}
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate(`/findings?severity=${item.label}&status=OPEN`)
              }
            >
              <Badge label={item.label} variant="severity" />
              <span style={{ marginLeft: 8 }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* === Exposure Summary === */}
      <div
        style={{
          marginTop: 30,
          padding: 20,
          border: "1px solid #e5e7eb",
          borderRadius: 8,
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 10 }}>
          Asset Exposure
        </div>
        <div>
          {riskyAssetCount} / {totalAssets} assets affected
          <span style={{ marginLeft: 12, fontWeight: 600 }}>
            ({exposurePercent}% exposure)
          </span>
        </div>
      </div>

      {/* === Last Scan === */}
      {lastScan && (
        <div
          style={{
            marginTop: 30,
            padding: 20,
            border: "1px solid #e5e7eb",
            borderRadius: 8,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 10 }}>
            Last Scan
          </div>

          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <div>ID: {lastScan.scan_id}</div>
            <div>
              Status: <Badge label={lastScan.status} variant="status" />
            </div>
            <div>
              Duration:{" "}
              {lastScan.duration_ms
                ? `${lastScan.duration_ms / 1000}s`
                : "—"}
            </div>
          </div>
        </div>
      )}

      {/* === Top Risky Assets === */}
      <div style={{ marginTop: 30 }}>
        <div style={{ fontWeight: 600, marginBottom: 12 }}>
          Top Risky Assets
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left" }}>
              <th style={{ padding: "8px 0" }}>Asset ID</th>
              <th style={{ padding: "8px 0" }}>Open Findings</th>
            </tr>
          </thead>
          <tbody>
            {topRiskyAssets.map(([assetId, count]) => (
              <tr
                key={assetId}
                style={{
                  cursor: "pointer",
                  borderTop: "1px solid #f1f5f9",
                }}
                onClick={() =>
                  navigate(`/assets?q=${assetId}`)
                }
              >
                <td style={{ padding: "10px 0" }}>{assetId}</td>
                <td style={{ padding: "10px 0" }}>{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
