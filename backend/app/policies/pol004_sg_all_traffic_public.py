from typing import List

from app.engine.graph import AssetGraph
from app.normalizer.types import NormalizedSnapshot
from app.policies.base import BasePolicy
from app.policies.types import PolicyResult


class POL004SGAllTrafficPublic(BasePolicy):
    policy_id = "POL-004"
    title = "Security Group allows all traffic from internet"
    severity = "CRITICAL"
    description = "Security Group rule exposes all ports/protocols publicly."

    def evaluate(self, snap: NormalizedSnapshot, graph: AssetGraph) -> List[PolicyResult]:
        results: List[PolicyResult] = []

        for sg_key, sg in graph.nodes.items():
            if sg.asset_type != "security_group":
                continue

            for r in sg.data.get("inbound_rules", []):
                cidr = r.get("cidr")
                port = r.get("port")
                proto = str(r.get("protocol", "")).strip()

                if cidr != "0.0.0.0/0":
                    continue

                if port == "ALL" or proto == "-1":
                    results.append(
                        PolicyResult(
                            policy_id=self.policy_id,
                            severity=self.severity,
                            risk_score=99,
                            title=self.title,
                            description=self.description,
                            remediation="Remove the allow-all inbound rule. Use least privilege inbound rules.",
                            resource_id=sg.asset_id,
                            resource_type="security_group",
                            region=sg.region,
                            evidence={"sg_id": sg.asset_id, "rule": r},
                            asset_key=sg_key,
                        )
                    )

        return results
