from app.collectors.mock_aws_collector import MockAWSCollector
from app.engine.asset_mapper import AssetMapper
from app.engine.graph import GraphBuilder
from app.engine.policy_runner import PolicyRunner
from app.normalizer.mock_aws_normalizer import MockAWSNormalizer


def test_policy_runner_outputs_findings_dicts():
    collected = MockAWSCollector(region="ap-south-1").collect()
    snap = MockAWSNormalizer().normalize(collected)

    nodes = AssetMapper().map_assets(snap)
    graph = GraphBuilder().build(nodes)

    finding_dicts = PolicyRunner().run(snap, graph)

    assert len(finding_dicts) >= 4

    ids = {f["policy_id"] for f in finding_dicts}
    assert "POL-001" in ids
    assert "POL-005" in ids
    assert "POL-010" in ids
    assert "POL-012" in ids

    # required fields
    for f in finding_dicts:
        assert "asset_key" in f
        assert "resource_id" in f
        assert "resource_type" in f
        assert "region" in f


def test_policy_runner_always_generates_remediation():
    collected = MockAWSCollector(region="ap-south-1").collect()
    snap = MockAWSNormalizer().normalize(collected)

    nodes = AssetMapper().map_assets(snap)
    graph = GraphBuilder().build(nodes)

    finding_dicts = PolicyRunner().run(snap, graph)

    # must always return deterministic remediation for every finding
    assert len(finding_dicts) > 0

    for f in finding_dicts:
        # remediation must exist
        assert "remediation" in f
        assert isinstance(f["remediation"], str)
        assert f["remediation"].strip() != ""

        # proof: should contain policy tag
        pid = f.get("policy_id")
        assert pid is not None
        assert pid in f["remediation"] or f"[{pid}]" in f["remediation"]

        # proof: required format must exist (B10 deliverable)
        assert "Console Fix:" in f["remediation"]
        assert "CLI Fix:" in f["remediation"]
