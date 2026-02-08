import { useState } from "react";
import type { Finding } from "../../api/types";
import { Drawer } from "../ui/Drawer";
import { useFindingEvents } from "../../hooks/useFindingEvents";

type Tab =
  | "overview"
  | "evidence"
  | "remediation"
  | "timeline"
  | "ai";

interface Props {
  finding: Finding | null;
  onClose: () => void;
}

export function FindingDrawer({ finding, onClose }: Props) {
  const [tab, setTab] = useState<Tab>("overview");

  if (!finding) return null;

  const {
    data: events,
    isLoading: eventsLoading,
  } = useFindingEvents(finding.finding_id);

  return (
    <Drawer open={!!finding} onClose={onClose}>
      <div className="h-full p-4 text-sm flex flex-col gap-4">
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

        {/* Tabs */}
        <div className="flex gap-3 border-b border-border pb-2 text-sm">
          <button onClick={() => setTab("overview")}>
            Overview
          </button>
          <button onClick={() => setTab("evidence")}>
            Evidence
          </button>
          <button onClick={() => setTab("remediation")}>
            Remediation
          </button>
          <button onClick={() => setTab("timeline")}>
            Timeline
          </button>
          <button onClick={() => setTab("ai")}>
            AI Advisor
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {/* OVERVIEW */}
          {tab === "overview" && (
            <section className="space-y-2">
              <p><b>Policy ID:</b> {finding.policy_id}</p>
              <p><b>Status:</b> {finding.status}</p>
              <p><b>Severity:</b> {finding.severity}</p>
              <p><b>Risk Score:</b> {finding.risk_score.toFixed(1)}</p>
              <p>
                <b>Resource:</b>{" "}
                {finding.resource_type} / {finding.resource_id} (
                {finding.region ?? "global"})
              </p>
            </section>
          )}

          {/* EVIDENCE */}
          {tab === "evidence" && (
            <section className="space-y-2">
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
              <p className="text-xs opacity-60">
                Evidence payload will be expanded when backend is wired.
              </p>
            </section>
          )}

          {/* REMEDIATION */}
          {tab === "remediation" && (
            <section className="space-y-2">
              <ul className="list-disc pl-5 space-y-1">
                <li>Identify the affected resource.</li>
                <li>Review the policy requirements.</li>
                <li>Apply the recommended configuration.</li>
                <li>Re-run the scan to confirm resolution.</li>
              </ul>
              <p className="text-xs opacity-60">
                Detailed remediation steps will be provided by the backend.
              </p>
            </section>
          )}

          {/* TIMELINE */}
          {tab === "timeline" && (
            <section className="space-y-2 text-xs">
              {eventsLoading && (
                <p>Loading timeline…</p>
              )}

              {!eventsLoading && events && events.length > 0 && (
                <ul className="space-y-1">
                  {events.map((e) => (
                    <li key={e.id}>
                      <b>{e.event_type}:</b>{" "}
                      {new Date(e.created_at).toLocaleString()}
                    </li>
                  ))}
                </ul>
              )}

              {!eventsLoading && (!events || events.length === 0) && (
                <>
                  <p>
                    <b>CREATED:</b>{" "}
                    {new Date(finding.first_seen).toLocaleString()}
                  </p>
                  <p>
                    <b>LAST SEEN:</b>{" "}
                    {new Date(finding.last_seen).toLocaleString()}
                  </p>
                  {finding.status === "RESOLVED" && (
                    <p><b>RESOLVED:</b> —</p>
                  )}
                </>
              )}
            </section>
          )}

          {/* AI ADVISOR */}
          {tab === "ai" && (
            <section className="text-xs opacity-60 italic">
              AI advisor explanations will appear here.
            </section>
          )}
        </div>
      </div>
    </Drawer>
  );
}
