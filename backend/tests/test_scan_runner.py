from app.engine.scan_runner import ScanRunner


def test_scan_runner_mock_pipeline_generates_findings():
    out = ScanRunner().run(mode="mock", region="ap-south-1")

    assert out["assets_count"] > 0
    assert out["findings_count"] > 0

    # should include 12 policies now
    ids = set(out["policy_counts"].keys())
    assert "POL-001" in ids
    assert "POL-012" in ids
