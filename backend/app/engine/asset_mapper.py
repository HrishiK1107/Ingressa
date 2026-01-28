from typing import List

from app.engine.types import AssetNode
from app.normalizer.types import NormalizedSnapshot


class AssetMapper:
    """
    Turns normalized snapshot into canonical AssetNodes.
    """

    def map_assets(self, snap: NormalizedSnapshot) -> List[AssetNode]:
        assets: List[AssetNode] = []

        # 1) normalized assets (s3/security_group/iam_user/ec2 etc.)
        for a in snap.assets:
            assets.append(
                AssetNode(
                    asset_id=a.asset_id,
                    asset_type=a.asset_type,
                    region=a.region,
                    name=a.name,
                    data=a.data,
                )
            )

        # 2) IAM roles (from raw if present)
        roles = snap.raw.get("iam_roles", [])
        for r in roles:
            assets.append(
                AssetNode(
                    asset_id=r["role_name"],
                    asset_type="iam_role",
                    region=snap.region,
                    name=r["role_name"],
                    data=r,
                )
            )

        # 3) CloudTrail config asset (always 1)
        ct = snap.raw.get("cloudtrail", {})
        assets.append(
            AssetNode(
                asset_id=f"cloudtrail:{snap.account_id}",
                asset_type="cloudtrail",
                region=snap.region,
                name="cloudtrail",
                data=ct,
            )
        )

        return assets
