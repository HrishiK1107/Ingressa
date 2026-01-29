from typing import Dict, List

from app.db.models import Asset


def build_asset_lookup(assets: List[Asset]) -> Dict[str, int]:
    """
    Map asset graph key -> asset DB id
    """
    lookup: Dict[str, int] = {}
    for a in assets:
        k = f"{a.asset_type}:{a.asset_id}:{a.region}"
        lookup[k] = a.id
    return lookup
