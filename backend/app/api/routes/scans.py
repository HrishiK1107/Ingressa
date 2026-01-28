import logging
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.db.models import ScanRun
from app.schemas.scans import ScanRunOut
from app.storage.scan_store import ScanStore

router = APIRouter(prefix="/scans", tags=["scans"])
log = logging.getLogger("ingressa.scans")


@router.get("", response_model=List[ScanRunOut])
def list_scans(db: Session = Depends(get_db)):
    scans = db.query(ScanRun).order_by(ScanRun.started_at.desc()).limit(100).all()
    return scans


@router.get("/{scan_id}", response_model=ScanRunOut)
def get_scan(scan_id: str, db: Session = Depends(get_db)):
    scan = db.query(ScanRun).filter(ScanRun.scan_id == scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="scan not found")
    return scan


@router.post("/run", response_model=ScanRunOut)
def run_scan(
    mode: str = Query(default="mock", pattern="^(mock|aws)$"),
    db: Session = Depends(get_db),
):
    """
    B3 API Contract:
    creates a scan_run row and returns it.
    Actual pipeline execution happens later in B11 scan_runner.
    """
    store = ScanStore(db)
    scan = store.create_scan_run(mode=mode)

    log.info("scan created: %s mode=%s", scan.scan_id, mode)
    return scan
