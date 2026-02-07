import type { Finding } from "../../api/types";

interface Props {
  finding: Finding;
  onClose: () => void;
}

export function FindingDrawer({ finding, onClose }: Props) {
  return (
    <div className="h-full p-4 text-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">
          Finding {finding.finding_id}
        </h2>
        <button onClick={onClose}>Close</button>
      </div>

      <div className="space-y-2">
        <p><b>Policy ID:</b> {finding.policy_id}</p>
        <p><b>Status:</b> {finding.status}</p>
        <p><b>Severity:</b> {finding.severity}</p>
        <p><b>Risk Score:</b> {finding.risk_score.toFixed(1)}</p>

        <hr />

        <p><b>Resource ID:</b> {finding.resource_id}</p>
        <p><b>Resource Type:</b> {finding.resource_type}</p>
        <p><b>Region:</b> {finding.region ?? "global"}</p>

        <hr />

        <p><b>First Seen:</b> {new Date(finding.first_seen).toLocaleString()}</p>
        <p><b>Last Seen:</b> {new Date(finding.last_seen).toLocaleString()}</p>

        <hr />

        <p className="opacity-60 italic">
          Explainability panel will appear here
        </p>
      </div>
    </div>
  );
}
