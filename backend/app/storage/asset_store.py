from typing import Any, Dict, List, Optional, Tuple

from sqlalchemy.orm import Session

from app.db.models import Asset


class AssetStore:
    def __init__(self, db: Session):
        self.db = db

    def upsert_assets(self, assets: List[Dict[str, Any]]) -> Tuple[int, Dict[str, int]]:
        """
        Upsert assets by (asset_id, asset_type, region).
        Returns: (count_upserted, lookup_map)

        lookup_map maps:
          "<asset_type>:<asset_id>:<region>" -> asset_db_id
        """
        count = 0
        lookup: Dict[str, int] = {}

        for a in assets:
            asset_id = a["asset_id"]
            asset_type = a["asset_type"]
            region = a["region"]

            existing: Optional[Asset] = (
                self.db.query(Asset)
                .filter(
                    Asset.asset_id == asset_id,
                    Asset.asset_type == asset_type,
                    Asset.region == region,
                )
                .first()
            )

            if existing:
                existing.name = a.get("name")
                existing.data = a.get("data", {})
                asset_db_id = existing.id
            else:
                new_asset = Asset(
                    asset_id=asset_id,
                    asset_type=asset_type,
                    region=region,
                    name=a.get("name"),
                    data=a.get("data", {}),
                )
                self.db.add(new_asset)
                self.db.flush()  # get id without full commit
                asset_db_id = new_asset.id

            key = f"{asset_type}:{asset_id}:{region}"
            lookup[key] = asset_db_id
            count += 1

        self.db.commit()
        return count, lookup
