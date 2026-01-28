from datetime import datetime
from typing import Optional

from pydantic import Field

from app.schemas.common import APIModel


class ScanRunOut(APIModel):
    scan_id: str
    mode: str
    status: str
    started_at: datetime
    finished_at: Optional[datetime] = None


class ScanRunCreateIn(APIModel):
    mode: str = Field(default="mock", pattern="^(mock|aws)$")
