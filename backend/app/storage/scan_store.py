from datetime import datetime
from uuid import uuid4

from sqlalchemy.orm import Session

from app.db.models import ScanRun


class ScanStore:
    def __init__(self, db: Session):
        self.db = db

    def create_scan_run(self, mode: str) -> ScanRun:
        scan = ScanRun(
            scan_id=str(uuid4()),
            mode=mode,
            status="RUNNING",
            started_at=datetime.utcnow(),
        )
        self.db.add(scan)
        self.db.commit()
        self.db.refresh(scan)
        return scan

    def mark_success_with_stats(
        self,
        scan: ScanRun,
        asset_count: int,
        finding_count: int,
        duration_ms: int,
    ) -> None:
        scan.status = "SUCCESS"
        scan.finished_at = datetime.utcnow()
        scan.asset_count = asset_count
        scan.finding_count = finding_count
        scan.duration_ms = duration_ms
        scan.error_reason = None
        self.db.commit()

    def mark_failed_with_error(
        self,
        scan: ScanRun,
        error_reason: str,
        duration_ms: int,
    ) -> None:
        scan.status = "FAILED"
        scan.finished_at = datetime.utcnow()
        scan.error_reason = error_reason[:512]
        scan.duration_ms = duration_ms
        self.db.commit()
