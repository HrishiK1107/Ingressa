import { useScans } from "../hooks/useScans";
import { ScanControlPanel } from "../components/console/ScanControlPanel";

export default function Scans() {
  const { data, isLoading, isError, refetch } = useScans();

  if (isLoading) return <div>Loading…</div>;
  if (isError) return <div>Error loading scans</div>;
  if (!data) return null;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "260px 1fr",
        gap: 24,
        alignItems: "start",
      }}
    >
      {/* LEFT: Scan controls */}
      <ScanControlPanel onScanStarted={refetch} />

      {/* RIGHT: Scans table */}
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
            {data.scans.map((scan) => (
              <tr key={scan.scan_id}>
                <td>{scan.scan_id}</td>
                <td>{scan.mode}</td>
                <td>{scan.status}</td>
                <td>{scan.started_at}</td>
                <td>{scan.finished_at ?? "-"}</td>
                <td>{scan.asset_count ?? "-"}</td>
                <td>{scan.finding_count ?? "-"}</td>
                <td>{scan.duration_ms ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
