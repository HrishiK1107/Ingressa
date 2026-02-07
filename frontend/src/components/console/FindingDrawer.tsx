import type { Finding } from "../../api/types";

interface Props {
  finding: Finding | null;
  onClose: () => void;
}

export function FindingDrawer({ finding, onClose }: Props) {
  if (!finding) return null;

  return (
    <div
      style={{
        position: "fixed",
        right: 20,
        top: 20,
        border: "1px solid black",
        padding: 16,
        background: "white",
      }}
    >
      <h3>Finding {finding.finding_id}</h3>
      <p><b>Policy:</b> {finding.policy_id}</p>
      <p><b>Severity:</b> {finding.severity}</p>
      <p><b>Status:</b> {finding.status}</p>
      <p><b>Resource:</b> {finding.resource_id}</p>

      <button onClick={onClose}>Close</button>
    </div>
  );
}
