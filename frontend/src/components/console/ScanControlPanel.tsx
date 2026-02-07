import { useState } from "react";
import { Button } from "../ui/Button";

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
      onScanStarted();
    } catch (e) {
      console.error("Scan failed", e);
      alert("Scan failed. Check backend logs.");
    } finally {
      setRunning(null);
    }
  }

  return (
    <div className="w-[260px] space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Run Scan</h3>
        <p className="text-sm text-muted">
          Perform a cloud security scan.
        </p>
      </div>

      <Button
        variant="primary"
        loading={running === "mock"}
        disabled={running !== null}
        onClick={() => runScan("mock")}
        className="w-full"
      >
        Mock Scan
      </Button>

      <Button
        variant="secondary"
        loading={running === "aws"}
        disabled={running !== null}
        onClick={() => runScan("aws")}
        className="w-full"
      >
        AWS Scan
      </Button>
    </div>
  );
}
