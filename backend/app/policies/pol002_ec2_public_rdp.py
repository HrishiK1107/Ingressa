from typing import List

from app.engine.graph import AssetGraph
from app.normalizer.types import NormalizedSnapshot
from app.policies.base import BasePolicy
from app.policies.types import PolicyResult


class POL002EC2PublicRDP(BasePolicy):
    policy_id = "POL-002"
    title = "EC2 has public RDP exposed"
    severity = "CRITICAL"
    description = "EC2 instance has port 3389 open to the internet."

    def evaluate(self, snap: NormalizedSnapshot, graph: AssetGraph) -> List[PolicyResult]:
        results: List[PolicyResult] = []

        for ec2_key, ec2 in graph.nodes.items():
            if ec2.asset_type != "ec2":
                continue

            public_ip = ec2.data.get("public_ip")
            if not public_ip:
                continue

            sg_keys = graph.neighbors(ec2_key, relation="attached_sg")
            for sg_key in sg_keys:
                sg = graph.nodes.get(sg_key)
                if not sg:
                    continue

                rules = sg.data.get("inbound_rules", [])
                for r in rules:
                    if r.get("port") == 3389 and r.get("cidr") == "0.0.0.0/0":
                        results.append(
                            PolicyResult(
                                policy_id=self.policy_id,
                                severity=self.severity,
                                risk_score=95,
                                title=self.title,
                                description=self.description,
                                remediation="Restrict RDP to trusted IPs or remove port 3389 from public SG rules.",
                                resource_id=ec2.asset_id,
                                resource_type="ec2",
                                region=ec2.region,
                                evidence={
                                    "instance_id": ec2.asset_id,
                                    "public_ip": public_ip,
                                    "sg_id": sg.asset_id,
                                    "rule": r,
                                },
                                asset_key=ec2_key,
                            )
                        )

        return results
