from typing import List

from app.engine.graph import AssetGraph
from app.normalizer.types import NormalizedSnapshot
from app.policies.base import BasePolicy
from app.policies.types import PolicyResult


class POL001S3PublicBucket(BasePolicy):
    policy_id = "POL-001"
    title = "S3 bucket allows public access"
    severity = "CRITICAL"
    description = "S3 bucket without proper public access block can expose data publicly."

    def evaluate(self, snap: NormalizedSnapshot, graph: AssetGraph) -> List[PolicyResult]:
        results: List[PolicyResult] = []

        for k, node in graph.nodes.items():
            if node.asset_type != "s3":
                continue

            public_access_block = node.data.get("public_access_block", True)
            if public_access_block is True:
                continue

            results.append(
                PolicyResult(
                    policy_id=self.policy_id,
                    severity=self.severity,
                    risk_score=95,
                    title=self.title,
                    description=self.description,
                    remediation="Enable S3 Block Public Access on the bucket and account level.",
                    resource_id=node.asset_id,
                    resource_type="s3",
                    region=node.region,
                    evidence={"bucket": node.asset_id, "public_access_block": public_access_block},
                    asset_key=k,
                )
            )

        return results
