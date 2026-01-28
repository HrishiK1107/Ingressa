from typing import Any, Dict, List

from app.collectors.types import CollectorOutput
from app.normalizer.base import BaseNormalizer
from app.normalizer.types import NormalizedAsset, NormalizedSnapshot


class MockAWSNormalizer(BaseNormalizer):
    name = "mock_aws_normalizer"

    def normalize(self, collected: CollectorOutput) -> NormalizedSnapshot:
        resources: Dict[str, Any] = collected.resources
        assets: List[NormalizedAsset] = []

        # -------------------------
        # S3 buckets
        # -------------------------
        for b in resources.get("s3_buckets", []):
            assets.append(
                NormalizedAsset(
                    asset_id=b["name"],
                    asset_type="s3",
                    region=collected.region,
                    name=b["name"],
                    data={
                        "public_access_block": b.get("public_access_block", True),
                        "encryption": b.get("encryption", "UNKNOWN"),
                        "versioning": b.get("versioning", False),
                        "acl": b.get(
                            "acl",
                            {"public_read": False, "public_write": False},
                        ),
                    },
                )
            )

        # -------------------------
        # Security groups
        # -------------------------
        for sg in resources.get("security_groups", []):
            assets.append(
                NormalizedAsset(
                    asset_id=sg["group_id"],
                    asset_type="security_group",
                    region=collected.region,
                    name=sg.get("name"),
                    data={
                        "inbound_rules": sg.get("inbound_rules", []),
                    },
                )
            )

        # -------------------------
        # IAM users
        # -------------------------
        for u in resources.get("iam_users", []):
            assets.append(
                NormalizedAsset(
                    asset_id=u["user_name"],
                    asset_type="iam_user",
                    region=collected.region,
                    name=u["user_name"],
                    data={
                        "is_admin": u.get("is_admin", False),
                        "mfa_enabled": u.get("mfa_enabled", False),
                        "access_keys": u.get("access_keys", []),
                        "attached_policies": u.get("attached_policies", []),
                        "permissions": u.get("permissions", {"actions": []}),
                    },
                )
            )

        # -------------------------
        # EC2 instances
        # -------------------------
        for i in resources.get("ec2_instances", []):
            assets.append(
                NormalizedAsset(
                    asset_id=i["instance_id"],
                    asset_type="ec2",
                    region=collected.region,
                    name=i["instance_id"],
                    data={
                        "public_ip": i.get("public_ip"),
                        "security_groups": i.get("security_groups", []),
                        "iam_role": i.get("iam_role"),
                        "metadata_options": i.get("metadata_options", {}),
                    },
                )
            )

        # -------------------------
        # raw preservation (for policies)
        # -------------------------
        raw = {
            "cloudtrail": resources.get("cloudtrail", {}),
            "iam_roles": resources.get("iam_roles", []),
        }

        return NormalizedSnapshot(
            account_id=collected.account_id,
            region=collected.region,
            collected_at=collected.collected_at,
            assets=assets,
            raw=raw,
        )
