from dataclasses import dataclass
from datetime import datetime
from typing import Any, Dict


@dataclass(frozen=True)
class CollectorOutput:
    account_id: str
    region: str
    collected_at: datetime
    resources: Dict[str, Any]
