from typing import List

from app.engine.graph import AssetGraph
from app.normalizer.types import NormalizedSnapshot
from app.policies.base import BasePolicy
from app.policies.types import PolicyResult


class POL006S3PublicWrite(BasePolicy):
    policy_id = "POL-006"
    title = "S3 bucket allows public write"
    severity = "CRITICAL"
    description = "S3 bucket appears to allow public write access."

    def evaluate(self, snap: NormalizedSnapshot, graph: AssetGraph) -> List[PolicyResult]:
        results: List[PolicyResult] = []

        for bucket_key, b in graph.nodes.items():
            if b.asset_type != "s3":
                continue

            acl = b.data.get("acl", {})
            public_write = bool(acl.get("public_write", False))

            if public_write:
                results.append(
                    PolicyResult(
                        policy_id=self.policy_id,
                        severity=self.severity,
                        risk_score=95,
                        title=self.title,
                        description=self.description,
                        remediation="Remove public write permissions. Enable Block Public Access.",
                        resource_id=b.asset_id,
                        resource_type="s3",
                        region=b.region,
                        evidence={
                            "bucket": b.asset_id,
                            "acl": acl,
                        },
                        asset_key=bucket_key,
                    )
                )

        return results
