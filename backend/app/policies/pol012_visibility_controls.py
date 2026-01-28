from typing import List

from app.engine.graph import AssetGraph
from app.normalizer.types import NormalizedSnapshot
from app.policies.base import BasePolicy
from app.policies.types import PolicyResult


class POL012VisibilityControls(BasePolicy):
    policy_id = "POL-012"
    title = "Visibility and metadata controls are weak"
    severity = "MEDIUM"
    description = "CloudTrail should be enabled and EC2 metadata should enforce IMDSv2."

    def evaluate(self, snap: NormalizedSnapshot, graph: AssetGraph) -> List[PolicyResult]:
        results: List[PolicyResult] = []

        # A) CloudTrail config
        ct = snap.raw.get("cloudtrail", {})
        if ct and ct.get("enabled") is False:
            results.append(
                PolicyResult(
                    policy_id=self.policy_id,
                    severity=self.severity,
                    risk_score=60,
                    title="CloudTrail is disabled",
                    description="Without CloudTrail, auditing and incident investigation are weakened.",
                    remediation="Enable CloudTrail in all regions and send logs to a secured S3 bucket.",
                    resource_id=f"cloudtrail:{snap.account_id}",
                    resource_type="cloudtrail",
                    region=snap.region,
                    evidence={"cloudtrail": ct},
                    asset_key=f"cloudtrail:cloudtrail:{snap.account_id}:{snap.region}",
                )
            )

        # B) EC2 IMDSv2
        for k, node in graph.nodes.items():
            if node.asset_type != "ec2":
                continue

            http_tokens = node.data.get("metadata_options", {}).get("http_tokens", "").lower()
            if http_tokens == "optional":
                results.append(
                    PolicyResult(
                        policy_id=self.policy_id,
                        severity=self.severity,
                        risk_score=65,
                        title="EC2 instance does not enforce IMDSv2",
                        description="IMDSv2 should be required to reduce SSRF credential theft risk.",
                        remediation="Set metadata options to require IMDSv2 (http_tokens=required).",
                        resource_id=node.asset_id,
                        resource_type="ec2",
                        region=node.region,
                        evidence={"instance_id": node.asset_id, "http_tokens": http_tokens},
                        asset_key=f"cloudtrail:cloudtrail:{snap.account_id}:{snap.region}",
                    )
                )

        return results
