from typing import Any, Dict, List

from app.engine.graph import AssetGraph
from app.normalizer.types import NormalizedSnapshot
from app.policies.base import BasePolicy
from app.policies.types import PolicyResult


def _is_wildcard_action(action: str) -> bool:
    if action == "*":
        return True
    if action.endswith(":*"):
        return True
    return False


def _has_wildcard_statement(statements: List[Dict[str, Any]]) -> bool:
    for st in statements:
        actions = st.get("actions", [])
        resources = st.get("resources", [])
        if any(_is_wildcard_action(str(a)) for a in actions) and "*" in resources:
            return True
    return False


class POL010WildcardPolicies(BasePolicy):
    policy_id = "POL-010"
    title = "Wildcard IAM policies detected"
    severity = "HIGH"
    description = "Wildcard IAM policies allow overly broad permissions."

    def evaluate(self, snap: NormalizedSnapshot, graph: AssetGraph) -> List[PolicyResult]:
        results: List[PolicyResult] = []

        # A) IAM users
        for user_key, u in graph.nodes.items():
            if u.asset_type != "iam_user":
                continue

            policies = u.data.get("attached_policies", [])
            for p in policies:
                statements = p.get("statements", [])
                if _has_wildcard_statement(statements):
                    results.append(
                        PolicyResult(
                            policy_id=self.policy_id,
                            severity=self.severity,
                            risk_score=80,
                            title=self.title,
                            description=self.description,
                            remediation="Replace wildcard policies with least-privilege actions/resources.",
                            resource_id=u.asset_id,
                            resource_type="iam_user",
                            region=u.region,
                            evidence={
                                "principal": u.asset_id,
                                "principal_type": "iam_user",
                                "policy": p,
                            },
                            asset_key=user_key,
                        )
                    )

        # B) IAM roles (from raw)
        for r in snap.raw.get("iam_roles", []):
            role_name = r.get("role_name")
            policies = r.get("attached_policies", [])
            for p in policies:
                statements = p.get("statements", [])
                if _has_wildcard_statement(statements):
                    results.append(
                        PolicyResult(
                            policy_id=self.policy_id,
                            severity=self.severity,
                            risk_score=80,
                            title=self.title,
                            description=self.description,
                            remediation="Replace wildcard role policies with least-privilege scoped permissions.",
                            resource_id=role_name,
                            resource_type="iam_role",
                            region=snap.region,
                            evidence={
                                "principal": role_name,
                                "principal_type": "iam_role",
                                "policy": p,
                            },
                            asset_key=f"iam_role:{role_name}:{snap.region}",
                        )
                    )

        return results
