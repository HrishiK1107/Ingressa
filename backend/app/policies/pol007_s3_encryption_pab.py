from typing import List

from app.engine.graph import AssetGraph
from app.normalizer.types import NormalizedSnapshot
from app.policies.base import BasePolicy
from app.policies.types import PolicyResult


class POL007S3EncryptionPABMisconfig(BasePolicy):
    policy_id = "POL-007"
    title = "S3 bucket encryption / public access block misconfigured"
    severity = "MEDIUM"
    description = "S3 bucket does not enforce encryption and/or public access block."

    def evaluate(self, snap: NormalizedSnapshot, graph: AssetGraph) -> List[PolicyResult]:
        results: List[PolicyResult] = []

        for bucket_key, b in graph.nodes.items():
            if b.asset_type != "s3":
                continue

            enc = str(b.data.get("encryption", "UNKNOWN")).upper()
            pab = bool(b.data.get("public_access_block", True))

            bad_encryption = enc in ("NONE", "UNKNOWN", "")
            bad_pab = pab is False

            if bad_encryption or bad_pab:
                score = 65
                if bad_encryption and bad_pab:
                    score = 75

                results.append(
                    PolicyResult(
                        policy_id=self.policy_id,
                        severity=self.severity,
                        risk_score=score,
                        title=self.title,
                        description=self.description,
                        remediation="Enable default encryption (SSE-S3 or SSE-KMS) and enforce Block Public Access.",
                        resource_id=b.asset_id,
                        resource_type="s3",
                        region=b.region,
                        evidence={
                            "bucket": b.asset_id,
                            "encryption": enc,
                            "public_access_block": pab,
                        },
                        asset_key=bucket_key,
                    )
                )

        return results
