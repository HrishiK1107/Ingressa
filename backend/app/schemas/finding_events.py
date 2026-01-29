from datetime import datetime
from typing import Any, Dict, Optional

from pydantic import BaseModel


class FindingEventOut(BaseModel):
    id: int
    finding_id: int
    event_type: str
    message: str
    created_at: datetime
    snapshot: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True
