from typing import List

from app.engine.graph import AssetGraph
from app.normalizer.types import NormalizedSnapshot
from app.policies.base import BasePolicy
from app.policies.types import PolicyResult


class POL005S3PublicRead(BasePolicy):
    policy_id = "POL-005"
    title = "S3 bucket allows public read"
    severity = "HIGH"
    description = "S3 bucket appears to allow public read access."

    def evaluate(self, snap: NormalizedSnapshot, graph: AssetGraph) -> List[PolicyResult]:
        results: List[PolicyResult] = []

        for bucket_key, b in graph.nodes.items():
            if b.asset_type != "s3":
                continue

            acl = b.data.get("acl", {})
            public_read = bool(acl.get("public_read", False))
            pab = bool(b.data.get("public_access_block", True))

            if public_read or (pab is False):
                results.append(
                    PolicyResult(
                        policy_id=self.policy_id,
                        severity=self.severity,
                        risk_score=80,
                        title=self.title,
                        description=self.description,
                        remediation="Enable Block Public Access and remove any public-read ACL/policy.",
                        resource_id=b.asset_id,
                        resource_type="s3",
                        region=b.region,
                        evidence={
                            "bucket": b.asset_id,
                            "public_access_block": pab,
                            "acl": acl,
                        },
                        asset_key=bucket_key,
                    )
                )

        return results
