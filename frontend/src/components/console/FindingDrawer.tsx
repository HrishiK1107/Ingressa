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
      <div className="h-full p-4 text-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">
            Finding {finding.finding_id}
          </h2>
          <button
            className="text-sm underline"
            onClick={onClose}
          >
            Close
          </button>
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

          <p>
            <b>First Seen:</b>{" "}
            {new Date(finding.first_seen).toLocaleString()}
          </p>
          <p>
            <b>Last Seen:</b>{" "}
            {new Date(finding.last_seen).toLocaleString()}
          </p>

          <hr />

          <p className="opacity-60 italic">
            Explainability panel will appear here
          </p>
        </div>
      </div>
    </Drawer>
  );
}
