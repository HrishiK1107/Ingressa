from typing import List

from app.engine.graph import AssetGraph
from app.normalizer.types import NormalizedSnapshot
from app.policies.base import BasePolicy
from app.policies.types import PolicyResult


class POL010IAMUserMFA(BasePolicy):
    policy_id = "POL-010"
    title = "IAM user without MFA has active access keys"
    severity = "HIGH"
    description = "MFA is required for IAM users with programmatic access keys."

    def evaluate(self, snap: NormalizedSnapshot, graph: AssetGraph) -> List[PolicyResult]:
        results: List[PolicyResult] = []

        for k, node in graph.nodes.items():
            if node.asset_type != "iam_user":
                continue

            mfa_enabled = node.data.get("mfa_enabled", False)
            keys = node.data.get("access_keys", [])

            has_active_key = any(bool(x.get("active")) for x in keys)
            max_age = 0
            for x in keys:
                if x.get("active") and isinstance(x.get("age_days"), int):
                    max_age = max(max_age, x["age_days"])

            if (not mfa_enabled) and has_active_key:
                risk = 85 if max_age >= 90 else 75

                results.append(
                    PolicyResult(
                        policy_id=self.policy_id,
                        severity=self.severity,
                        risk_score=risk,
                        title=self.title,
                        description=self.description,
                        remediation="Enable MFA for the IAM user and rotate/remove long-lived access keys.",
                        resource_id=node.asset_id,
                        resource_type="iam_user",
                        region=node.region,
                        evidence={
                            "user": node.asset_id,
                            "mfa_enabled": mfa_enabled,
                            "active_keys": keys,
                            "max_age_days": max_age,
                        },
                        asset_key=k,
                    )
                )

        return results
