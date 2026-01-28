from dataclasses import dataclass
from typing import Any, Dict, Optional


@dataclass(frozen=True)
class AssetNode:
    asset_id: str
    asset_type: str
    region: str
    name: Optional[str]
    data: Dict[str, Any]
