from typing import Any, Dict, Tuple


class RiskScorer:
    """
    Deterministic Risk Scoring Engine (0-100)

    Input:
      finding dict = {
        policy_id, severity, evidence, resource_type, ...
      }

    Output:
      (score, bucket)

    Design goals:
      - stable
      - explainable
      - deterministic
      - no ML
    """

    SEVERITY_BASE = {
        "LOW": 25,
        "MEDIUM": 50,
        "HIGH": 75,
        "CRITICAL": 90,
    }

    def _bucket(self, score: int) -> str:
        if score >= 90:
            return "CRITICAL"
        if score >= 70:
            return "HIGH"
        if score >= 40:
            return "MEDIUM"
        return "LOW"

    def _boosters(self, finding: Dict[str, Any]) -> Tuple[int, Dict[str, Any]]:
        """
        Returns:
          (boost_points, explain_dict)
        """
        boost = 0
        explain: Dict[str, Any] = {"boosts": []}

        policy_id = finding.get("policy_id", "")
        rtype = finding.get("resource_type", "")
        evidence = finding.get("evidence") or {}

        # 1) Public exposure boosters
        # EC2 public with SSH/RDP/ports
        if policy_id in ("POL-001", "POL-002", "POL-003", "POL-004"):
            boost += 10
            explain["boosts"].append({"type": "public_exposure", "points": 10})

        # 2) S3 public access boosters
        if policy_id in ("POL-005", "POL-006", "POL-007"):
            boost += 8
            explain["boosts"].append({"type": "public_storage_exposure", "points": 8})

        # 3) IAM high impact boosters
        if policy_id in ("POL-008", "POL-010", "POL-011"):
            boost += 12
            explain["boosts"].append({"type": "iam_privilege_risk", "points": 12})

        # 4) CloudTrail disabled booster
        if policy_id == "POL-012" or rtype == "cloudtrail":
            boost += 6
            explain["boosts"].append({"type": "logging_gap", "points": 6})

        # 5) Evidence-driven boosters (optional and safe)
        # if evidence explicitly signals wildcard / admin
        wildcard = evidence.get("wildcard", False)
        if wildcard is True:
            boost += 8
            explain["boosts"].append({"type": "wildcard_permission", "points": 8})

        return boost, explain

    def score(self, finding: Dict[str, Any]) -> Dict[str, Any]:
        sev = (finding.get("severity") or "").upper().strip()
        base = self.SEVERITY_BASE.get(sev, 30)

        boost, explain = self._boosters(finding)
        raw = base + boost

        score = max(0, min(100, int(raw)))
        bucket = self._bucket(score)

        return {
            "risk_score": score,
            "risk_bucket": bucket,
            "score_explain": {
                "severity_base": base,
                **explain,
                "final": score,
            },
        }
