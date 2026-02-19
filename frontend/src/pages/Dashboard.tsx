import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { endpoints } from "../api/endpoints";
import Loading from "../components/common/Loading";
import ErrorState from "../components/common/ErrorState";
import Badge from "../components/common/Badge";
import StatCard from "../components/common/StatCard";

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

  const openFindings = findings.filter((f) => f.status === "OPEN");

  const critical = openFindings.filter((f) => f.severity === "CRITICAL").length;
  const high = openFindings.filter((f) => f.severity === "HIGH").length;
  const medium = openFindings.filter((f) => f.severity === "MEDIUM").length;
  const low = openFindings.filter((f) => f.severity === "LOW").length;

  const totalAssets = assets.length;
  const openCount = openFindings.length;

  const riskyAssetsMap: Record<string, number> = {};
  openFindings.forEach((f) => {
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

  // purely visual demo delta
  const riskDelta = 0.18;

  // risk classification (visual only)
  const riskLevel =
    riskPercent > 70
      ? "CRITICAL"
      : riskPercent > 40
      ? "ELEVATED"
      : "LOW";

  return (
    <div className="dashboard-fullscreen">
      <div className="dashboard-header">
        <h2 className="page-title">Dashboard</h2>
        <div className="data-freshness">
          Updated just now
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Total Assets" value={totalAssets} />

        <StatCard
          label="Open Findings"
          value={openCount}
          className="primary"
        />

        <StatCard label="Critical Findings" value={critical} />

        <StatCard
          label="Risk Index"
          value={riskIndex}
          progressPercent={riskPercent}
        >
          <div className="risk-meta">
            <span className={`risk-level ${riskLevel.toLowerCase()}`}>
              {riskLevel}
            </span>

            <span
              className={`risk-delta ${
                riskDelta >= 0 ? "negative" : "positive"
              }`}
            >
              {riskDelta >= 0 ? "+" : ""}
              {riskDelta.toFixed(2)} vs previous scan
            </span>
          </div>
        </StatCard>
      </div>

      <div className="severity-strip compact">
        {[
          { label: "CRITICAL", value: critical },
          { label: "HIGH", value: high },
          { label: "MEDIUM", value: medium },
          { label: "LOW", value: low },
        ].map((item) => (
          <div
            key={item.label}
            className={`severity-pill ${item.label.toLowerCase()}`}
            onClick={() =>
              navigate(`/findings?severity=${item.label}&status=OPEN`)
            }
          >
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>

      <div className="dashboard-row refined">
        <div className="panel-card refined-panel">
          <div className="panel-title">Asset Exposure</div>
          <div className="exposure-main">
            <strong>{riskyAssetCount}</strong> / {totalAssets} assets affected
            <span className="exposure-percent">
              {exposurePercent}% exposure
            </span>
          </div>
        </div>

        {lastScan && (
          <div className="panel-card refined-panel">
            <div className="panel-title">Last Scan</div>

            <div className="scan-grid">
              <div>
                <div className="scan-label">ID</div>
                <div className="scan-value">{lastScan.scan_id}</div>
              </div>

              <div>
                <div className="scan-label">Status</div>
                <Badge label={lastScan.status} variant="status" />
              </div>

              <div>
                <div className="scan-label">Duration</div>
                <div className="scan-value">
                  {lastScan.duration_ms
                    ? `${lastScan.duration_ms / 1000}s`
                    : "—"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="panel-card table-panel">
        <div className="panel-title">Top Risky Assets</div>

        <div className="dashboard-table-wrapper">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Asset ID</th>
                <th>Open Findings</th>
              </tr>
            </thead>
            <tbody>
              {topRiskyAssets.map(([assetId, count]) => (
                <tr
                  key={assetId}
                  onClick={() => navigate(`/assets?q=${assetId}`)}
                >
                  <td>{assetId}</td>
                  <td>
                    <span className="finding-count">
                      {count}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
