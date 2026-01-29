import logging
import time

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.config import settings
from app.db.models import ScanRun
from app.engine.scan_runner import ScanRunner
from app.schemas.scans import ScanRunListOut, ScanRunOut
from app.storage.asset_store import AssetStore
from app.storage.finding_store import FindingStore
from app.storage.scan_store import ScanStore

router = APIRouter(prefix="/scans", tags=["scans"])
log = logging.getLogger("ingressa.scans")


# =========================
# Run a scan
# =========================
@router.post("/run", response_model=ScanRunOut)
def run_scan(
    mode: str = Query(default="mock", pattern="^(mock|aws)$"),
    db: Session = Depends(get_db),
):
    scan_store = ScanStore(db)
    asset_store = AssetStore(db)
    finding_store = FindingStore(db)

    scan = scan_store.create_scan_run(mode)
    start_time = time.time()

    try:
        runner = ScanRunner()
        out = runner.run(mode=mode, region=settings.AWS_REGION_DEFAULT)

        asset_count, asset_lookup = asset_store.upsert_assets(out["assets"])

        finding_count = finding_store.reconcile_findings(
            scan_run=scan,
            finding_dicts=out["findings"],
            asset_lookup=asset_lookup,
            region=settings.AWS_REGION_DEFAULT,
        )

        duration_ms = int((time.time() - start_time) * 1000)

        scan_store.mark_success_with_stats(
            scan=scan,
            asset_count=asset_count,
            finding_count=finding_count,
            duration_ms=duration_ms,
        )

    except Exception as e:
        duration_ms = int((time.time() - start_time) * 1000)
        log.exception("scan run failed: %s", e)

        scan_store.mark_failed_with_error(
            scan=scan,
            error_reason=str(e),
            duration_ms=duration_ms,
        )

        raise HTTPException(status_code=500, detail="scan failed")

    db.refresh(scan)
    return scan


# =========================
# List scan runs (B11.2.3)
# =========================
@router.get("", response_model=ScanRunListOut)
def list_scans(
    db: Session = Depends(get_db),
    limit: int = Query(default=20, ge=1, le=100),
):
    scans = db.query(ScanRun).order_by(ScanRun.started_at.desc()).limit(limit).all()

    return {"scans": scans}
