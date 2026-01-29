from app.engine.scoring import RiskScorer


def test_risk_scoring_deterministic_bucket():
    scorer = RiskScorer()

    f = {
        "policy_id": "POL-001",
        "severity": "CRITICAL",
        "resource_type": "ec2",
        "region": "ap-south-1",
        "evidence": {},
    }

    out = scorer.score(f)

    assert out["risk_score"] >= 90
    assert out["risk_bucket"] == "CRITICAL"
    assert "severity_base" in out["score_explain"]
    assert out["score_explain"]["final"] == out["risk_score"]
