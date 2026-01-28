from dataclasses import dataclass
from datetime import datetime
from typing import Any, Dict, List, Optional


@dataclass(frozen=True)
class NormalizedAsset:
    asset_id: str
    asset_type: str
    region: str
    name: Optional[str]
    data: Dict[str, Any]


@dataclass(frozen=True)
class NormalizedSnapshot:
    account_id: str
    region: str
    collected_at: datetime
    assets: List[NormalizedAsset]
    raw: Dict[str, Any]
