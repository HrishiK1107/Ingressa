from typing import List, Set

from app.engine.graph import AssetGraph
from app.normalizer.types import NormalizedSnapshot
from app.policies.base import BasePolicy
from app.policies.types import PolicyResult

PRIV_ESC_ACTIONS: Set[str] = {
    "iam:passrole",
    "iam:createaccesskey",
    "sts:assumerole",
    "iam:attachuserpolicy",
    "iam:putuserpolicy",
    "iam:updateassumerolepolicy",
}


class POL011PrivilegeEscalationPerms(BasePolicy):
    policy_id = "POL-011"
    title = "Privilege escalation permissions detected"
    severity = "CRITICAL"
    description = "Permissions may allow privilege escalation paths."

    def evaluate(self, snap: NormalizedSnapshot, graph: AssetGraph) -> List[PolicyResult]:
        results: List[PolicyResult] = []

        # A) users
        for user_key, u in graph.nodes.items():
            if u.asset_type != "iam_user":
                continue

            actions = u.data.get("permissions", {}).get("actions", [])
            lowered = {str(a).lower() for a in actions}
            hits = sorted(list(lowered.intersection(PRIV_ESC_ACTIONS)))

            if hits:
                results.append(
                    PolicyResult(
                        policy_id=self.policy_id,
                        severity=self.severity,
                        risk_score=95,
                        title=self.title,
                        description=self.description,
                        remediation="Review and restrict privilege escalation permissions. Use boundaries & SCPs.",
                        resource_id=u.asset_id,
                        resource_type="iam_user",
                        region=u.region,
                        evidence={
                            "principal": u.asset_id,
                            "principal_type": "iam_user",
                            "dangerous_actions": hits,
                        },
                        asset_key=user_key,
                    )
                )

        # B) roles
        for r in snap.raw.get("iam_roles", []):
            role_name = r.get("role_name")
            actions = r.get("permissions", {}).get("actions", [])
            lowered = {str(a).lower() for a in actions}
            hits = sorted(list(lowered.intersection(PRIV_ESC_ACTIONS)))

            if hits:
                results.append(
                    PolicyResult(
                        policy_id=self.policy_id,
                        severity=self.severity,
                        risk_score=95,
                        title=self.title,
                        description=self.description,
                        remediation="Restrict role permissions. Audit PassRole + AssumeRole chains.",
                        resource_id=role_name,
                        resource_type="iam_role",
                        region=snap.region,
                        evidence={
                            "principal": role_name,
                            "principal_type": "iam_role",
                            "dangerous_actions": hits,
                        },
                        asset_key=f"iam_role:{role_name}:{snap.region}",
                    )
                )

        return results
