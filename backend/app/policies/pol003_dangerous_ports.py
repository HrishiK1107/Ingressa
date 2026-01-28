from typing import List

from app.engine.graph import AssetGraph
from app.normalizer.types import NormalizedSnapshot
from app.policies.base import BasePolicy
from app.policies.types import PolicyResult

DANGEROUS_PORTS = {445, 1433, 3306, 5432, 27017, 9200}


class POL003DangerousPortsExposed(BasePolicy):
    policy_id = "POL-003"
    title = "Dangerous ports exposed to internet"
    severity = "HIGH"
    description = "Sensitive service ports are open to 0.0.0.0/0."

    def evaluate(self, snap: NormalizedSnapshot, graph: AssetGraph) -> List[PolicyResult]:
        results: List[PolicyResult] = []

        for sg_key, sg in graph.nodes.items():
            if sg.asset_type != "security_group":
                continue

            for r in sg.data.get("inbound_rules", []):
                port = r.get("port")
                cidr = r.get("cidr")
                if cidr != "0.0.0.0/0":
                    continue
                if isinstance(port, int) and port in DANGEROUS_PORTS:
                    results.append(
                        PolicyResult(
                            policy_id=self.policy_id,
                            severity=self.severity,
                            risk_score=80,
                            title=self.title,
                            description=self.description,
                            remediation="Restrict these ports to internal ranges or remove public access.",
                            resource_id=sg.asset_id,
                            resource_type="security_group",
                            region=sg.region,
                            evidence={"sg_id": sg.asset_id, "rule": r},
                            asset_key=sg_key,
                        )
                    )

        return results
