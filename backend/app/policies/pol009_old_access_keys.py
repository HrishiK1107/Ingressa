from typing import List

from app.engine.graph import AssetGraph
from app.normalizer.types import NormalizedSnapshot
from app.policies.base import BasePolicy
from app.policies.types import PolicyResult


class POL009OldAccessKeys(BasePolicy):
    policy_id = "POL-009"
    title = "Old IAM access keys detected (>90 days)"
    severity = "HIGH"
    description = "Long-lived access keys increase compromise risk."

    def evaluate(self, snap: NormalizedSnapshot, graph: AssetGraph) -> List[PolicyResult]:
        results: List[PolicyResult] = []

        for user_key, u in graph.nodes.items():
            if u.asset_type != "iam_user":
                continue

            keys = u.data.get("access_keys", [])
            for k in keys:
                if not k.get("active"):
                    continue
                age = k.get("age_days")
                if isinstance(age, int) and age > 90:
                    results.append(
                        PolicyResult(
                            policy_id=self.policy_id,
                            severity=self.severity,
                            risk_score=85,
                            title=self.title,
                            description=self.description,
                            remediation="Rotate access keys regularly. Use short-lived creds (STS) where possible.",
                            resource_id=u.asset_id,
                            resource_type="iam_user",
                            region=u.region,
                            evidence={
                                "user": u.asset_id,
                                "key_id": k.get("id"),
                                "age_days": age,
                            },
                            asset_key=user_key,
                        )
                    )

        return results
