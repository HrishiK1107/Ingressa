from datetime import datetime
from typing import Any, Dict, List, Optional

from app.schemas.common import APIModel


class FindingEventOut(APIModel):
    event_type: str
    message: str
    created_at: datetime
    snapshot: Optional[Dict[str, Any]] = None


class FindingOut(APIModel):
    finding_id: int
    policy_id: str
    severity: str
    risk_score: int
    status: str

    resource_id: str
    resource_type: str
    region: str

    first_seen: datetime
    last_seen: datetime


class FindingDetailOut(FindingOut):
    evidence: Dict[str, Any]
    remediation: str
    events: List[FindingEventOut] = []
