from datetime import datetime
from typing import Any, Dict, List

from sqlalchemy.orm import Session

from app.db.models import Finding, ScanRun


class FindingStore:
    def __init__(self, db: Session):
        self.db = db

    def reconcile_findings(
        self,
        scan_run: ScanRun,
        finding_dicts: List[Dict[str, Any]],
        asset_lookup: Dict[str, int],
    ) -> int:
        """
        Reconcile findings for this scan.

        LOCKED key:
          (policy_id + resource_id)

        Expected finding_dict format:
        {
          "policy_id": "POL-001",
          "severity": "CRITICAL",
          "risk_score": 95,
          "status": "OPEN",
          "resource_id": "i-123...",
          "resource_type": "ec2",
          "region": "ap-south-1",
          "asset_key": "ec2:i-123:ap-south-1",
          "evidence": {...},
          "remediation": "..."
        }
        """
        now = datetime.utcnow()
        count = 0

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

            count += 1

        self.db.commit()
        return count
