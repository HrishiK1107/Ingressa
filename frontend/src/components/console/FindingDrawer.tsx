import { useEffect, useRef } from "react";
import type { Finding } from "../../api/types";
import { formatDate } from "../../utils/format";

interface Props {
  finding: Finding | null;
  onClose: () => void;
}

export function FindingDrawer({ finding, onClose }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!finding) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [finding, onClose]);

  useEffect(() => {
    if (!finding) return;

    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }

    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [finding, onClose]);

  if (!finding) return null;

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        right: 20,
        top: 20,
        width: 360,
        border: "1px solid black",
        padding: 16,
        background: "white",
        zIndex: 50,
      }}
    >
      <h3>Finding {finding.finding_id}</h3>

      <p><b>Policy ID:</b> {finding.policy_id}</p>
      <p><b>Status:</b> {finding.status}</p>
      <p><b>Severity:</b> {finding.severity}</p>
      <p><b>Risk Score:</b> {finding.risk_score.toFixed(1)}</p>

      <hr />

      <p><b>Resource ID:</b> {finding.resource_id}</p>
      <p><b>Resource Type:</b> {finding.resource_type}</p>
      <p><b>Region:</b> {finding.region ?? "global"}</p>

      <hr />

      <p><b>First Seen:</b> {formatDate(finding.first_seen)}</p>
      <p><b>Last Seen:</b> {formatDate(finding.last_seen)}</p>

      <hr />

      <p><b>Risk Explanation</b></p>
      <p style={{ opacity: 0.6, fontStyle: "italic" }}>
        (Explainability panel will appear here)
      </p>

      <button onClick={onClose}>Close</button>
    </div>
  );
}
