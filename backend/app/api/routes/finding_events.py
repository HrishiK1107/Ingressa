from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.finding_events import FindingEventOut
from app.storage.finding_store import FindingStore

router = APIRouter(prefix="/findings", tags=["findings"])


@router.get("/{finding_id}/events", response_model=list[FindingEventOut])
def get_finding_events(finding_id: int, db: Session = Depends(get_db)):
    store = FindingStore(db)

    events = store.list_events(finding_id=finding_id)
    if not events:
        # could be "finding not found" OR "no events"
        # we treat empty as 404 for clean UI behavior.
        raise HTTPException(status_code=404, detail="no events found")

    return events
