import { useState } from "react";

interface Props {
  onScanStarted: () => void;
}

export function ScanControlPanel({ onScanStarted }: Props) {
  const [running, setRunning] = useState<"mock" | "aws" | null>(null);

  async function runScan(mode: "mock" | "aws") {
    setRunning(mode);
    try {
      await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/scans/run?mode=${mode}`,
        { method: "POST" }
      );
      onScanStarted(); // refresh scans list
    } catch (e) {
      console.error("Scan failed", e);
      alert("Scan failed. Check backend logs.");
    } finally {
      setRunning(null);
    }
  }

  return (
    <div style={{ width: 260 }}>
      <h3>Run Scan</h3>

      <p>Perform a cloud security scan.</p>

      <button
        onClick={() => runScan("mock")}
        disabled={running !== null}
        style={{ display: "block", marginBottom: 8 }}
      >
        {running === "mock" ? "Running…" : "Mock Scan"}
      </button>

      <button
        onClick={() => runScan("aws")}
        disabled={running !== null}
      >
        {running === "aws" ? "Running…" : "AWS Scan"}
      </button>
    </div>
  );
}
