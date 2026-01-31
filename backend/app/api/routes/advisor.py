from fastapi import APIRouter, HTTPException

from app.ai.advisor import Advisor
from app.db import get_session
from app.storage.finding_store import FindingStore

router = APIRouter(prefix="/ai", tags=["ai"])
advisor = Advisor()


@router.get("/explain/{finding_id}")
def explain_finding(finding_id: int):
    with get_session() as db:
        store = FindingStore(db)
        finding = store.get_finding_by_id(finding_id)

        if not finding:
            raise HTTPException(status_code=404, detail="Finding not found")

        return advisor.advise(finding.to_dict())
