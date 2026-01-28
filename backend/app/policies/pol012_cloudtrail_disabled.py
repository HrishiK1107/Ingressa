from typing import List

from app.engine.graph import AssetGraph
from app.normalizer.types import NormalizedSnapshot
from app.policies.base import BasePolicy
from app.policies.types import PolicyResult


class POL012CloudTrailDisabledOrNotMultiRegion(BasePolicy):
    policy_id = "POL-012"
    title = "CloudTrail disabled or not multi-region"
    severity = "CRITICAL"
    description = "CloudTrail must be enabled and configured for multi-region logging."

    def evaluate(self, snap: NormalizedSnapshot, graph: AssetGraph) -> List[PolicyResult]:
        results: List[PolicyResult] = []

        ct = snap.raw.get("cloudtrail", {})
        enabled = bool(ct.get("enabled", False))
        multi = bool(ct.get("multi_region", False))

        if enabled and multi:
            return results

        reasons = []
        if not enabled:
            reasons.append("disabled")
        if enabled and (not multi):
            reasons.append("not_multi_region")
        if (not enabled) and (not multi):
            reasons.append("disabled_and_not_multi_region")

        results.append(
            PolicyResult(
                policy_id=self.policy_id,
                severity=self.severity,
                risk_score=95,
                title=self.title,
                description=self.description,
                remediation="Enable CloudTrail and configure multi-region trails with secure log storage.",
                resource_id=f"cloudtrail:{snap.account_id}",
                resource_type="cloudtrail",
                region=snap.region,
                evidence={
                    "cloudtrail": ct,
                    "enabled": enabled,
                    "multi_region": multi,
                    "reason": reasons,
                },
                asset_key=f"cloudtrail:cloudtrail:{snap.account_id}:{snap.region}",
            )
        )

        return results
