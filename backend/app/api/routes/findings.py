import logging
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.db.models import Finding
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
        remediation=finding.remediation,
        events=events,
    )
