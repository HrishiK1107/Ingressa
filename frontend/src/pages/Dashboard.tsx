import { useAssets } from "../hooks/useAssets";
import { useFindings } from "../hooks/useFindings";
import { useScans } from "../hooks/useScans";

export default function Dashboard() {
  const assetsQ = useAssets();
  const findingsQ = useFindings();
  const scansQ = useScans();

  if (
    assetsQ.isLoading ||
    findingsQ.isLoading ||
    scansQ.isLoading
  ) {
    return <div>Loading…</div>;
  }

  if (
    assetsQ.isError ||
    findingsQ.isError ||
    scansQ.isError
  ) {
    return <div>Error loading dashboard</div>;
  }

  // 🔒 HARD GUARDS (this is what you were missing)
  const assets = assetsQ.data?.items ?? [];
  const findings = findingsQ.data ?? [];
  const scans = scansQ.data?.scans ?? [];

  const totalAssets = assets.length;
  const totalFindings = findings.length;
  const openFindings = findings.filter(
    (f) => f.status === "OPEN"
  ).length;
  const totalScans = scans.length;

  return (
    <div>
      <h1>Dashboard</h1>

      <ul>
        <li>Total Assets: {totalAssets}</li>
        <li>Total Findings: {totalFindings}</li>
        <li>Open Findings: {openFindings}</li>
        <li>Total Scans: {totalScans}</li>
      </ul>
    </div>
  );
}
