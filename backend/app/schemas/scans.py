from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class ScanRunOut(BaseModel):
    scan_id: str
    mode: str
    status: str

    started_at: datetime
    finished_at: Optional[datetime]

    asset_count: Optional[int]
    finding_count: Optional[int]
    duration_ms: Optional[int]
    error_reason: Optional[str]

    class Config:
        orm_mode = True


class ScanRunListOut(BaseModel):
    scans: List[ScanRunOut]
