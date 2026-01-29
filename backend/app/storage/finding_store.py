from datetime import datetime
from typing import Any, Dict, List, Set, Tuple

from sqlalchemy.orm import Session

from app.db.models import Finding, FindingEvent, ScanRun


class FindingStore:
    def __init__(self, db: Session):
        self.db = db

    def _add_event(
        self,
        finding: Finding,
        event_type: str,
        message: str,
        snapshot: dict,
    ) -> None:
        """
        Adds a FindingEvent, but blocks duplicate spam by checking the latest event.
        """
        last = (
            self.db.query(FindingEvent)
            .filter(FindingEvent.finding_id == finding.id)
            .order_by(FindingEvent.created_at.desc())
            .first()
        )

        # idempotency guard
        if last and last.event_type == event_type and last.message == message:
            return

        ev = FindingEvent(
            finding_id=finding.id,
            event_type=event_type,
            message=message,
            created_at=datetime.utcnow(),
            snapshot=snapshot,
        )
        self.db.add(ev)

    def _has_any_event(self, finding_id: int) -> bool:
        return (
            self.db.query(FindingEvent).filter(FindingEvent.finding_id == finding_id).first()
            is not None
        )

    def reconcile_findings(
        self,
        scan_run: ScanRun,
        finding_dicts: List[Dict[str, Any]],
        asset_lookup: Dict[str, int],
        region: str,
    ) -> int:
        """
        Reconcile findings for this scan.

        LOCKED reconciliation key:
          (policy_id + resource_id)

        Adds FindingEvent timeline:
          CREATED / UPDATED / RESOLVED

        Resolves stale findings:
          OPEN -> RESOLVED if not triggered in this scan (scoped by region).

        IMPORTANT:
        If findings existed before events were introduced, we create a one-time
        baseline CREATED event for those existing findings to start the timeline.
        """
        now = datetime.utcnow()
        count = 0

        # -------------------------
        # Current scan keyset
        # -------------------------
        current_keys: Set[Tuple[str, str]] = set()
        for f in finding_dicts:
            current_keys.add((f["policy_id"], f["resource_id"]))

        # -------------------------
        # Resolve stale OPEN findings in this region
        # -------------------------
        existing_open = (
            self.db.query(Finding)
            .filter(
                Finding.status == "OPEN",
                Finding.region == region,
            )
            .all()
        )

        for old in existing_open:
            key = (old.policy_id, old.resource_id)
            if key in current_keys:
                continue

            old.status = "RESOLVED"
            old.last_seen = now
            old.scan_run_id = scan_run.id

            self._add_event(
                old,
                event_type="RESOLVED",
                message=(
                    f"Resolved: {old.policy_id} no longer detected on "
                    f"{old.resource_type}:{old.resource_id}"
                ),
                snapshot={
                    "policy_id": old.policy_id,
                    "resource_id": old.resource_id,
                    "resource_type": old.resource_type,
                    "region": old.region,
                    "severity": old.severity,
                    "risk_score": old.risk_score,
                    "status": "RESOLVED",
                },
            )

        # -------------------------
        # Upsert findings from this scan
        # -------------------------
        for f in finding_dicts:
            policy_id = f["policy_id"]
            resource_id = f["resource_id"]

            existing = (
                self.db.query(Finding)
                .filter(
                    Finding.policy_id == policy_id,
                    Finding.resource_id == resource_id,
                )
                .first()
            )

            # Map asset FK
            asset_key = f.get("asset_key")
            if not asset_key or asset_key not in asset_lookup:
                raise ValueError(
                    f"asset_key missing/unmapped for finding {policy_id}:{resource_id}"
                )

            asset_db_id = asset_lookup[asset_key]

            if existing:
                # baseline event for older findings
                if not self._has_any_event(existing.id):
                    self._add_event(
                        existing,
                        event_type="CREATED",
                        message=(
                            f"Created finding: {policy_id} on "
                            f"{existing.resource_type}:{existing.resource_id}"
                        ),
                        snapshot={
                            "policy_id": policy_id,
                            "resource_id": resource_id,
                            "resource_type": existing.resource_type,
                            "region": existing.region,
                            "severity": existing.severity,
                            "risk_score": existing.risk_score,
                            "status": existing.status,
                            "evidence": existing.evidence,
                        },
                    )

                old_snapshot = {
                    "severity": existing.severity,
                    "risk_score": existing.risk_score,
                    "status": existing.status,
                    "evidence": existing.evidence,
                    "remediation": existing.remediation,
                }

                existing.last_seen = now
                existing.status = f.get("status", "OPEN")
                existing.severity = f["severity"]
                existing.risk_score = int(f["risk_score"])
                existing.evidence = f.get("evidence", {})
                existing.remediation = f.get("remediation", "")
                existing.scan_run_id = scan_run.id
                existing.asset_id_fk = asset_db_id
                existing.resource_type = f["resource_type"]
                existing.region = f["region"]

                new_snapshot = {
                    "severity": existing.severity,
                    "risk_score": existing.risk_score,
                    "status": existing.status,
                    "evidence": existing.evidence,
                    "remediation": existing.remediation,
                }

                if old_snapshot != new_snapshot:
                    self._add_event(
                        existing,
                        event_type="UPDATED",
                        message=(
                            f"Updated finding: {policy_id} on "
                            f"{existing.resource_type}:{existing.resource_id}"
                        ),
                        snapshot={
                            "before": old_snapshot,
                            "after": new_snapshot,
                            "policy_id": policy_id,
                            "resource_id": resource_id,
                        },
                    )

            else:
                new_finding = Finding(
                    policy_id=policy_id,
                    severity=f["severity"],
                    risk_score=int(f["risk_score"]),
                    status=f.get("status", "OPEN"),
                    resource_id=resource_id,
                    resource_type=f["resource_type"],
                    region=f["region"],
                    evidence=f.get("evidence", {}),
                    remediation=f.get("remediation", ""),
                    first_seen=now,
                    last_seen=now,
                    scan_run_id=scan_run.id,
                    asset_id_fk=asset_db_id,
                )
                self.db.add(new_finding)
                self.db.flush()  # generate id

                self._add_event(
                    new_finding,
                    event_type="CREATED",
                    message=(
                        f"Created finding: {policy_id} on "
                        f"{new_finding.resource_type}:{new_finding.resource_id}"
                    ),
                    snapshot={
                        "policy_id": policy_id,
                        "resource_id": resource_id,
                        "resource_type": new_finding.resource_type,
                        "region": new_finding.region,
                        "severity": new_finding.severity,
                        "risk_score": new_finding.risk_score,
                        "status": new_finding.status,
                        "evidence": new_finding.evidence,
                    },
                )

            count += 1

        self.db.commit()
        return count

    def list_events(self, finding_id: int) -> List[FindingEvent]:
        return (
            self.db.query(FindingEvent)
            .filter(FindingEvent.finding_id == finding_id)
            .order_by(FindingEvent.created_at.desc())
            .all()
        )
