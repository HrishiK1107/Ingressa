from typing import List

from app.engine.graph import AssetGraph
from app.normalizer.types import NormalizedSnapshot
from app.policies.base import BasePolicy
from app.policies.types import PolicyResult


class POL005SecurityGroupOpenSSH(BasePolicy):
    policy_id = "POL-005"
    title = "Security Group allows SSH from 0.0.0.0/0"
    severity = "HIGH"
    description = "SSH open to the world increases risk of brute force and compromise."

    def evaluate(self, snap: NormalizedSnapshot, graph: AssetGraph) -> List[PolicyResult]:
        results: List[PolicyResult] = []

        for k, node in graph.nodes.items():
            if node.asset_type != "security_group":
                continue

            rules = node.data.get("inbound_rules", [])
            for r in rules:
                if r.get("port") == 22 and r.get("cidr") == "0.0.0.0/0":
                    results.append(
                        PolicyResult(
                            policy_id=self.policy_id,
                            severity=self.severity,
                            risk_score=80,
                            title=self.title,
                            description=self.description,
                            remediation="Restrict SSH inbound rule to trusted IP ranges or remove it.",
                            resource_id=node.asset_id,
                            resource_type="security_group",
                            region=node.region,
                            evidence={"sg_id": node.asset_id, "rule": r},
                            asset_key=k,
                        )
                    )

        return results
