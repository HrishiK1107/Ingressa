import logging

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.config import settings
from app.engine.scan_runner import ScanRunner
from app.schemas.scans import ScanRunOut
from app.storage.asset_store import AssetStore
from app.storage.finding_store import FindingStore
from app.storage.scan_store import ScanStore

router = APIRouter(prefix="/scans", tags=["scans"])
log = logging.getLogger("ingressa.scans")


@router.post("/run", response_model=ScanRunOut)
def run_scan(
    mode: str = Query(default="mock", pattern="^(mock|aws)$"),
    db: Session = Depends(get_db),
):
    scan_store = ScanStore(db)
    asset_store = AssetStore(db)
    finding_store = FindingStore(db)

    # 1) create scan run
    scan = scan_store.create_scan_run(mode)

    try:
        # 2) run pipeline
        runner = ScanRunner()
        out = runner.run(mode=mode, region=settings.AWS_REGION_DEFAULT)

        # 3) persist assets -> returns (count, lookup)
        _, asset_lookup = asset_store.upsert_assets(out["assets"])

        # 4) persist findings
        finding_store.reconcile_findings(
            scan_run=scan,
            finding_dicts=out["findings"],
            asset_lookup=asset_lookup,
        )

        # 5) mark scan success
        scan_store.mark_success(scan)

    except Exception as e:
        log.exception("scan run failed: %s", e)
        scan_store.mark_failed(scan)
        raise HTTPException(status_code=500, detail="scan failed")

    db.refresh(scan)
    return scan
