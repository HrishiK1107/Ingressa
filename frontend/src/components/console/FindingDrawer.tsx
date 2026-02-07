import type { Finding } from "../../api/types";
import { Drawer } from "../ui/Drawer";

interface Props {
  finding: Finding | null;
  onClose: () => void;
}

export function FindingDrawer({ finding, onClose }: Props) {
  if (!finding) return null;

  return (
    <Drawer open={!!finding} onClose={onClose}>
      <div className="h-full p-4 text-sm space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Finding {finding.finding_id}
          </h2>
          <button
            className="text-sm underline"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        {/* Summary */}
        <section>
          <h3 className="font-semibold mb-2">Summary</h3>
          <div className="space-y-1">
            <p><b>Policy ID:</b> {finding.policy_id}</p>
            <p><b>Status:</b> {finding.status}</p>
            <p><b>Severity:</b> {finding.severity}</p>
            <p><b>Risk Score:</b> {finding.risk_score.toFixed(1)}</p>
            <p>
              <b>Resource:</b>{" "}
              {finding.resource_type} / {finding.resource_id} (
              {finding.region ?? "global"})
            </p>
          </div>
        </section>

        <hr />

        {/* Evidence */}
        <section>
          <h3 className="font-semibold mb-2">Evidence</h3>
          <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
{JSON.stringify(
  {
    finding_id: finding.finding_id,
    policy_id: finding.policy_id,
    resource_id: finding.resource_id,
    resource_type: finding.resource_type,
    region: finding.region,
  },
  null,
  2
)}
          </pre>
          <p className="text-xs opacity-60 mt-1">
            Evidence payload will be expanded when backend is wired.
          </p>
        </section>

        <hr />

        {/* Remediation */}
        <section>
          <h3 className="font-semibold mb-2">Remediation</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Identify the affected resource.</li>
            <li>Review the policy requirements.</li>
            <li>Apply the recommended configuration.</li>
            <li>Re-run the scan to confirm resolution.</li>
          </ul>
          <p className="text-xs opacity-60 mt-2">
            Detailed remediation steps will be provided by the backend.
          </p>
        </section>

        <hr />

        {/* Timeline */}
        <section>
          <h3 className="font-semibold mb-2">Timeline</h3>
          <ul className="space-y-1 text-xs">
            <li>
              <b>CREATED:</b>{" "}
              {new Date(finding.first_seen).toLocaleString()}
            </li>
            <li>
              <b>LAST SEEN:</b>{" "}
              {new Date(finding.last_seen).toLocaleString()}
            </li>
            {finding.status === "RESOLVED" && (
              <li><b>RESOLVED:</b> —</li>
            )}
          </ul>
        </section>
      </div>
    </Drawer>
  );
}
