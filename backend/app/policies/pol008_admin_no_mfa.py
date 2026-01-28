from typing import List

from app.engine.graph import AssetGraph
from app.normalizer.types import NormalizedSnapshot
from app.policies.base import BasePolicy
from app.policies.types import PolicyResult


class POL008AdminWithoutMFA(BasePolicy):
    policy_id = "POL-008"
    title = "Admin IAM user without MFA"
    severity = "CRITICAL"
    description = "Admin users must have MFA enabled."

    def evaluate(self, snap: NormalizedSnapshot, graph: AssetGraph) -> List[PolicyResult]:
        results: List[PolicyResult] = []

        for user_key, u in graph.nodes.items():
            if u.asset_type != "iam_user":
                continue

            is_admin = bool(u.data.get("is_admin", False))
            mfa = bool(u.data.get("mfa_enabled", False))

            if is_admin and (not mfa):
                results.append(
                    PolicyResult(
                        policy_id=self.policy_id,
                        severity=self.severity,
                        risk_score=95,
                        title=self.title,
                        description=self.description,
                        remediation="Enable MFA for admin users. Prefer hardware MFA / identity center.",
                        resource_id=u.asset_id,
                        resource_type="iam_user",
                        region=u.region,
                        evidence={
                            "user": u.asset_id,
                            "is_admin": is_admin,
                            "mfa_enabled": mfa,
                        },
                        asset_key=user_key,
                    )
                )

        return results
