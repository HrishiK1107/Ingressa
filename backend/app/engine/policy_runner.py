from typing import Any, Dict, List

from app.engine.graph import AssetGraph
from app.engine.scoring import RiskScorer
from app.normalizer.types import NormalizedSnapshot
from app.policies.default_registry import build_default_registry
from app.policies.types import PolicyResult


class PolicyRunner:
    """
    Runs registered policies and converts to FindingStore input dicts.

    B9.4:
    - Risk scoring is centralized and deterministic.
    - risk_score from policy is ignored/overwritten.
    """

    def run(self, snap: NormalizedSnapshot, graph: AssetGraph) -> List[Dict[str, Any]]:
        reg = build_default_registry()
        scorer = RiskScorer()

        results: List[PolicyResult] = []
        for p in reg.all():
            results.extend(p.evaluate(snap, graph))

        finding_dicts: List[Dict[str, Any]] = []

        for r in results:
            # build base finding
            finding: Dict[str, Any] = {
                "policy_id": r.policy_id,
                "severity": r.severity,
                "status": r.status,
                "resource_id": r.resource_id,
                "resource_type": r.resource_type,
                "region": r.region,
                "evidence": r.evidence,
                "remediation": r.remediation,
                # required for FindingStore asset FK mapping
                "asset_key": r.asset_key,
            }

            # centralized deterministic scoring
            score_out = scorer.score(finding)

            finding["risk_score"] = int(score_out["risk_score"])

            # attach explainability into evidence for UI later
            evidence = finding.get("evidence") or {}
            evidence["_risk"] = {
                "bucket": score_out["risk_bucket"],
                "explain": score_out["score_explain"],
            }
            finding["evidence"] = evidence

            finding_dicts.append(finding)

        return finding_dicts
