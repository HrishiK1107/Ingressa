from fastapi import APIRouter, HTTPException

from app.ai.advisor import Advisor
from app.db.session import get_session
from app.storage.finding_store import FindingStore

router = APIRouter(prefix="/ai", tags=["ai"])
advisor = Advisor()


@router.get("/explain/{finding_id}")
def explain_finding(finding_id: int):
    # ✅ Correct session usage: context manager
    with get_session() as db:
        store = FindingStore(db)
        finding = store.get_finding_by_id(finding_id)

        if not finding:
            raise HTTPException(status_code=404, detail="Finding not found")

        # ✅ Explicit serialization boundary (ORM → dict)
        finding_dict = {
            "id": finding.id,
            "policy_id": finding.policy_id,
            "severity": finding.severity,
            "risk_score": finding.risk_score,
            "status": finding.status,
            "resource_id": finding.resource_id,
            "resource_type": finding.resource_type,
            "region": finding.region,
            "evidence": finding.evidence or {},
            "remediation": finding.remediation or "",
            "first_seen": finding.first_seen.isoformat() if finding.first_seen else None,
            "last_seen": finding.last_seen.isoformat() if finding.last_seen else None,
        }

        return advisor.advise(finding_dict)
