from typing import Any, Dict, List

from app.engine.graph import AssetGraph
from app.normalizer.types import NormalizedSnapshot
from app.policies.default_registry import build_default_registry
from app.policies.types import PolicyResult


class PolicyRunner:
    """
    Runs registered policies and converts to FindingStore input dicts.
    """

    def run(self, snap: NormalizedSnapshot, graph: AssetGraph) -> List[Dict[str, Any]]:
        reg = build_default_registry()

        results: List[PolicyResult] = []
        for p in reg.all():
            results.extend(p.evaluate(snap, graph))

        finding_dicts: List[Dict[str, Any]] = []
        for r in results:
            finding_dicts.append(
                {
                    "policy_id": r.policy_id,
                    "severity": r.severity,
                    "risk_score": int(r.risk_score),
                    "status": r.status,
                    "resource_id": r.resource_id,
                    "resource_type": r.resource_type,
                    "region": r.region,
                    "evidence": r.evidence,
                    "remediation": r.remediation,
                    # required for FindingStore asset FK mapping
                    "asset_key": r.asset_key,
                }
            )

        return finding_dicts
