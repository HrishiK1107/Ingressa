# Drift & Lifecycle Management

## 1. Purpose

Ingressa does not treat findings as static alerts.

Instead, it models findings as lifecycle entities that evolve across scan executions.

Drift reconciliation ensures:

- No duplicate findings
- Accurate resolution state
- Historical traceability
- Reduced alert fatigue

This behavior mirrors production cloud security platforms.

---

## 2. Finding Identity Model

Each finding is uniquely identified by:

```
policy_id + resource_id
```

This composite key ensures:

- Idempotent detection
- Stable lifecycle tracking
- No duplicate alerts across scans

A finding is not re-created if it already exists.
It is updated.

---

## 3. Lifecycle States

Findings transition across the following states:

- CREATED
- UPDATED
- RESOLVED

### Definitions

**CREATED**

First time a violation is detected.

**UPDATED**

Violation still exists in subsequent scan.

**RESOLVED**

Violation existed previously but is no longer detected.

---

## 4. State Machine


stateDiagram-v2
    [*] --> CREATED
    CREATED --> UPDATED
    UPDATED --> UPDATED
    UPDATED --> RESOLVED
    CREATED --> RESOLVED
    RESOLVED --> [*]

State transition behavior:

- If violation persists → UPDATED
- If violation disappears → RESOLVED
- Once resolved, no further updates occur unless violation reappears

---

## 5. Drift Reconciliation Algorithm

After each scan:

1. Persist current violations.
2. Retrieve previously open findings.
3. Compare previous findings against current scan output.
4. Mark missing findings as RESOLVED.
5. Emit lifecycle events.

**Pseudo-logic:**

```
for previous_finding in open_findings:
    if previous_finding not in current_scan:
        mark as RESOLVED
```

This ensures scan-to-scan consistency.

---

## 6. Idempotency Guarantee

The detection pipeline guarantees:

- Identical cloud state → identical findings
- No duplicate finding rows
- No duplicate event emissions

This is enforced by:

- Composite identity key
- Deterministic detection
- Centralized persistence logic

---

## 7. Event Timeline

Every lifecycle transition emits an event:

- CREATED event
- UPDATED event
- RESOLVED event

Events provide:

- Auditability
- Historical tracking
- Timeline reconstruction
- Root cause correlation

This mirrors event-driven alert management systems.

---

## 8. Why Drift Matters

Without reconciliation:

- Alerts accumulate indefinitely
- False positives increase
- Engineers ignore dashboards
- Security posture degrades

Drift management ensures:

- Clean state
- Accurate exposure reporting
- Reliable risk prioritization

---

## 9. Reappearance Handling

If a resolved misconfiguration reappears:

- Detection emits violation again
- Finding re-enters CREATED state
- Event timeline reflects recurrence

This supports:

- Regression detection
- Compliance validation
- Exposure tracking

---

## 10. Design Tradeoffs

### Why Not Stateless Alerts?

Stateless alerts:

- Lack historical context
- Encourage duplication
- Provide no remediation tracking

Stateful lifecycle tracking:

- Enables posture measurement
- Enables trend analysis
- Enables compliance tracking

---

## 11. Summary

Ingressa implements:

- Idempotent finding identity
- Deterministic scan reconciliation
- Explicit lifecycle state transitions
- Event-based history tracking

This transforms detection from simple misconfiguration reporting into structured security posture intelligence.
