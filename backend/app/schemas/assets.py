from typing import Any, Dict, Optional

from app.schemas.common import APIModel


class AssetOut(APIModel):
    asset_id: str
    asset_type: str
    region: str
    name: Optional[str] = None
    data: Dict[str, Any]
