import logging
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.db.models import Finding
from app.engine.remediation import RemediationGenerator
from app.schemas.findings import FindingDetailOut, FindingOut

router = APIRouter(prefix="/findings", tags=["findings"])
log = logging.getLogger("ingressa.findings")


@router.get("", response_model=List[FindingOut])
def list_findings(
    db: Session = Depends(get_db),
    severity: Optional[str] = Query(default=None),
    status: Optional[str] = Query(default=None),
    policy_id: Optional[str] = Query(default=None),
    q: Optional[str] = Query(default=None, description="search by resource_id"),
    limit: int = Query(default=200, ge=1, le=500),
):
    query = db.query(Finding)

    if severity:
        query = query.filter(Finding.severity == severity)
    if status:
        query = query.filter(Finding.status == status)
    if policy_id:
        query = query.filter(Finding.policy_id == policy_id)
    if q:
        like = f"%{q}%"
        query = query.filter(Finding.resource_id.ilike(like))

    findings = (
        query.order_by(Finding.risk_score.desc(), Finding.last_seen.desc()).limit(limit).all()
    )

    return [
        FindingOut(
            finding_id=f.id,
            policy_id=f.policy_id,
            severity=f.severity,
            risk_score=f.risk_score,
            status=f.status,
            resource_id=f.resource_id,
            resource_type=f.resource_type,
            region=f.region,
            first_seen=f.first_seen,
            last_seen=f.last_seen,
        )
        for f in findings
    ]


@router.get("/{finding_id}", response_model=FindingDetailOut)
def get_finding(finding_id: int, db: Session = Depends(get_db)):
    finding = db.query(Finding).filter(Finding.id == finding_id).first()
    if not finding:
        raise HTTPException(status_code=404, detail="finding not found")

    # events already linked (lazy loaded)
    events = []
    for e in sorted(finding.events, key=lambda x: x.created_at):
        events.append(
            {
                "event_type": e.event_type,
                "message": e.message,
                "created_at": e.created_at,
                "snapshot": e.snapshot,
            }
        )

    remediation = (finding.remediation or "").strip()

    # policy -> expected resource_type guard (prevents wrong remediation on legacy data)
    EXPECTED_RESOURCE_TYPE = {
        "POL-001": "ec2",
        "POL-002": "ec2",
        "POL-003": "security_group",
        "POL-004": "security_group",
        "POL-005": "s3",
        "POL-006": "s3",
        "POL-007": "s3",
        "POL-008": "iam_user",
        "POL-009": "iam_user",
        "POL-010": None,  # may apply to user/role
        "POL-011": None,  # may apply to user/role
        "POL-012": "cloudtrail",
    }

    needs_upgrade = ("Console Fix:" not in remediation) or ("CLI Fix:" not in remediation)

    # B10 hard requirement: remediation must be structured, readable, AND not incorrect.
    # If old data exists, we upgrade deterministically.
    if needs_upgrade:
        expected = EXPECTED_RESOURCE_TYPE.get(finding.policy_id)

        # legacy mismatch: return safe generic remediation instead of wrong template
        if expected and finding.resource_type != expected:
            remediation = (
                "Remediation steps (generic)\n\n"
                "Console Fix:\n"
                "1) Verify this finding is correctly classified (legacy data mismatch detected).\n"
                "2) Review the affected resource configuration.\n"
                "3) Apply least privilege and secure-by-default configuration.\n\n"
                "CLI Fix:\n"
                "- Re-run scan and validate findings against current policies.\n"
                "- Fix insecure configuration based on evidence.\n\n"
                "Terraform hint:\n"
                "- Ensure IaC matches secure defaults and avoids broad public exposure.\n\n"
                f"Note: policy_id={finding.policy_id} expected_resource_type={expected} "
                f"but got resource_type={finding.resource_type}."
            )
        else:
            gen = RemediationGenerator()
            remediation = gen.generate(
                {
                    "policy_id": finding.policy_id,
                    "resource_id": finding.resource_id,
                    "resource_type": finding.resource_type,
                    "region": finding.region,
                    "evidence": finding.evidence or {},
                }
            )

    return FindingDetailOut(
        finding_id=finding.id,
        policy_id=finding.policy_id,
        severity=finding.severity,
        risk_score=finding.risk_score,
        status=finding.status,
        resource_id=finding.resource_id,
        resource_type=finding.resource_type,
        region=finding.region,
        first_seen=finding.first_seen,
        last_seen=finding.last_seen,
        evidence=finding.evidence,
        remediation=remediation,
        events=events,
    )
