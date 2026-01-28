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

    def mark_success(self, scan: ScanRun) -> None:
        scan.status = "SUCCESS"
        scan.finished_at = datetime.utcnow()
        self.db.commit()

    def mark_failed(self, scan: ScanRun) -> None:
        scan.status = "FAILED"
        scan.finished_at = datetime.utcnow()
        self.db.commit()
