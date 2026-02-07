import { useScans } from "../hooks/useScans";
import { ScanControlPanel } from "../components/console/ScanControlPanel";

export default function Scans() {
  const scansQuery = useScans();

  if (scansQuery.isLoading) return <div>Loading…</div>;
  if (scansQuery.isError) return <div>Error loading scans</div>;
  if (!scansQuery.data) return null;

  return (
    <div style={{ display: "flex", gap: 32 }}>
      {/* LEFT PANEL */}
      <ScanControlPanel onScanStarted={scansQuery.refetch} />

      {/* MAIN TABLE */}
      <div>
        <h1>Scans</h1>

        <table border={1} cellPadding={8}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Mode</th>
              <th>Status</th>
              <th>Started</th>
              <th>Finished</th>
              <th>Assets</th>
              <th>Findings</th>
              <th>Duration (ms)</th>
            </tr>
          </thead>
          <tbody>
            {scansQuery.data.scans.map((scan) => (
              <tr key={scan.scan_id}>
                <td>{scan.scan_id}</td>
                <td>{scan.mode}</td>
                <td>{scan.status}</td>
                <td>{scan.started_at}</td>
                <td>{scan.finished_at ?? "-"}</td>
                <td>{scan.asset_count}</td>
                <td>{scan.finding_count}</td>
                <td>{scan.duration_ms}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
